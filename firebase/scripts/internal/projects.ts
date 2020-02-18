import firebase from "firebase/app";
import {useState, useEffect} from "react";

import {useAuth} from "./auth";

export interface Project {
    id: string;
    title?: string;
    description?: string;
    admins?: string[];
    readers?: string[];
}

export const useProjectData = (): [Project[], Project[]] => {
    const [user] = useAuth();
    const [admin, setAdmin] = useState<Project[]>([]);
    const [reader, setReader] = useState<Project[]>([]);

    useEffect(() => {
        if (!user) return;

        const ref = firebase.firestore().collection("projects");

        const genHandler = (setter: (projects: Project[]) => void) => {
            return (snapshot: firebase.firestore.QuerySnapshot) =>
                setter(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    })),
                );
        };

        // TODO handle errors.
        const unsubscribeAdmin = ref
            .where("admins", "array-contains", user.email)
            .onSnapshot(genHandler(setAdmin));
        const unsubscribeReader = ref
            .where("readers", "array-contains", user.email)
            .onSnapshot(genHandler(setReader));

        return () => {
            unsubscribeAdmin();
            unsubscribeReader();
        };
    }, [user]);

    return [admin, reader];
};
