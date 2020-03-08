import React from "react";
import {Link, useLocation} from "react-router-dom";
import styled from "styled-components";

import {BlockedTask} from "../internal/tasks";

const TaskSummary = styled(Link)`
    &.selected {
        color: red;
    }
`;

export interface NestedTaskProps {
    task: BlockedTask;
}

export const NestedTask: React.FunctionComponent<NestedTaskProps> = (props) => {
    const {hash} = useLocation();

    return (
        <li>
            <TaskSummary
                to={{hash: props.task.id}}
                className={hash.endsWith(props.task.id) ? "selected" : ""}
            >
                {props.task.title || `task-${props.task.id}`}
            </TaskSummary>
            <ul>
                {props.task.blockers.map((task) => (
                    <NestedTask key={task.id} task={task} />
                ))}
            </ul>
        </li>
    );
};
