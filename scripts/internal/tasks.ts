import firebase from "firebase/app";
import {useState, useEffect} from "react";

import {useAuth} from "./auth";

export interface Task {
    id: string;
    title?: string;
    description?: string;
    blocking?: string;
    complete?: boolean;
}

export interface BlockedTask extends Task {
    blockers: BlockedTask[];
}

const attachBlockers = (tasks: Task[]): BlockedTask[] => {
    const blockedTaskMap: Record<string, BlockedTask> = {};
    const rootTasks: string[] = [];
    const blockers: Record<string, string[]> = {};
    for (const task of tasks) {
        blockedTaskMap[task.id] = {
            blockers: [],
            ...task,
        };
        if (!task.blocking) {
            rootTasks.push(task.id);
            continue;
        }
        if (!blockers[task.blocking]) {
            blockers[task.blocking] = [];
        }
        blockers[task.blocking].push(task.id);
    }
    for (const task of tasks) {
        const selfBlockers = blockers[task.id];
        if (selfBlockers !== undefined) {
            for (const blockerID of selfBlockers) {
                blockedTaskMap[task.id].blockers.push(
                    blockedTaskMap[blockerID],
                );
            }
        }
    }
    return rootTasks.map((taskId) => blockedTaskMap[taskId]);
};

export const useTaskData = (projectId?: string): [BlockedTask[], boolean] => {
    const [user, authLoading] = useAuth();
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        if (authLoading) {
            setLoading(true);
        }
        if (!authLoading && !user) {
            setLoading(false);
        }

        if (!projectId || !user) {
            setTasks([]);
            return;
        }

        const ref = firebase
            .firestore()
            .collection("projects")
            .doc(projectId)
            .collection("tasks");

        // TODO handle errors.
        const unsubscribe = ref.onSnapshot(
            (snapshot: firebase.firestore.QuerySnapshot) => {
                setTasks(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    })),
                );
                setLoading(false);
            }
        );
        return unsubscribe;
    }, [user, authLoading]);

    return [attachBlockers(tasks), loading];
};
