import React from "react";
import {useParams} from "react-router-dom";

import {Header} from "./Header";
import {NestedTask} from "./NestedTask";
import {useTaskData} from "../internal/tasks";
import {useAuth} from "../internal/auth";

export const Tasks: React.FunctionComponent = () => {
    const {projectId} = useParams();
    const [user, authLoading] = useAuth();
    const [tasks, tasksLoading] = useTaskData(projectId);

    if (authLoading || tasksLoading) {
        return (
            <>
                <Header />
                <span>loading</span>
            </>
        );
    }

    if (!user) {
        return (
            <>
                <Header />
                <span>login to create your first project</span>
            </>
        );
    }

    return (
        <>
            <Header />
            <h1>{projectId}</h1>
            <ul>
                {tasks.map((task) => (
                    <NestedTask key={task.id} task={task} />
                ))}
            </ul>
        </>
    );
};
