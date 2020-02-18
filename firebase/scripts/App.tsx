import React from "react";
import {BrowserRouter, Link, Route, Switch, useParams} from "react-router-dom";
import styled from "styled-components";

import {useAuth, login, logout} from "./internal/auth";
import {useProjectData} from "./internal/projects";
import {useTaskData, BlockedTask} from "./internal/tasks";

const AppWrapper = styled.div`
    border: 1px solid red;
`;

const VerticalLayout = styled.div`
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    padding: 2rem;
`;

const Projects = () => {
    const [user] = useAuth();
    const [adminProjects, readerProjects] = useProjectData();

    if (!user)
        return (
            <VerticalLayout>
                <button onClick={login}>login</button>
            </VerticalLayout>
        );

    const adminIDs: Record<string, string> = {};
    adminProjects.forEach(({id}) => (adminIDs[id] = "found"));

    return (
        <VerticalLayout>
            <button onClick={logout}>logout</button>
            <h1>{user.displayName}</h1>
            <h2>Admin</h2>
            <ul>
                {adminProjects.map((project) => (
                    <li key={project.id}>
                        <Link to={`/${project.id}`}>
                            {project.title || `project${project.id}`}
                        </Link>
                    </li>
                ))}
            </ul>
            <h2>Reader</h2>
            <ul>
                {readerProjects
                    .filter(({id}) => !adminIDs[id])
                    .map((project) => (
                        <li key={project.id}>
                            <Link to={`/${project.id}`}>
                                {project.title || `project-${project.id}`}
                            </Link>
                        </li>
                    ))}
            </ul>
        </VerticalLayout>
    );
};

const Tasks = () => {
    const {projectId} = useParams();
    const [tasks] = useTaskData(projectId);

    if (!projectId)
        return (
            <VerticalLayout>There has been a terrible mistake.</VerticalLayout>
        );

    return (
        <VerticalLayout>
            <h1>{projectId}</h1>
            <ul>
                {tasks.map((task) => (
                    <NestedTask key={task.id} task={task} />
                ))}
            </ul>
        </VerticalLayout>
    );
};

const NestedTask: React.FunctionComponent<{task: BlockedTask}> = (props) => (
    <li>
        <span>{props.task.title || `task-${props.task.id}`}</span>
        <ul>
            {props.task.blockers.map((task) => (
                <NestedTask key={task.id} task={task} />
            ))}
        </ul>
    </li>
);

export const App = () => (
    <AppWrapper>
        <BrowserRouter>
            <Switch>
                <Route exact path="/">
                    <Projects />
                </Route>
                <Route exact path="/:projectId">
                    <Tasks />
                </Route>
            </Switch>
        </BrowserRouter>
    </AppWrapper>
);
