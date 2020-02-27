import React from "react";
import {useParams} from "react-router-dom";

import {Header} from "./Header";
import {NestedTask} from "./NestedTask";
import {useTaskData} from "../internal/tasks";

export const Tasks: React.FunctionComponent = () => {
    const {projectId} = useParams();
    const [tasks] = useTaskData(projectId);

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
