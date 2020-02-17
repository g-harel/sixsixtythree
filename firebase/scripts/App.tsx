import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import styled from "styled-components";

import {useAuth, login, logout} from "./internal/auth";
import {useProjectData} from "./internal/projects";

const AppWrapper = styled.div`
    border: 1px solid red;
`;

const DemoWrapper = styled.div`
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    padding: 2rem;
`;

const Demo = () => {
    const [user] = useAuth();
    const [adminProjects, readerProjects] = useProjectData();

    if (!user)
        return (
            <DemoWrapper>
                <button onClick={login}>login</button>
            </DemoWrapper>
        );

    const adminIDs: Record<string, string> = {};
    adminProjects.forEach(({id}) => (adminIDs[id] = "found"));

    return (
        <DemoWrapper>
            <button onClick={logout}>logout</button>
            <h1>{user.displayName}</h1>
            <h2>Admin</h2>
            <ul>
                {adminProjects.map((project) => (
                    <li key={project.id}>
                        {project.title || `project${project.id}`}
                    </li>
                ))}
            </ul>
            <h2>Reader</h2>
            <ul>
                {readerProjects
                    .filter(({id}) => !adminIDs[id])
                    .map((project) => (
                        <li key={project.id}>
                            {project.title || `project${project.id}`}
                        </li>
                    ))}
            </ul>
        </DemoWrapper>
    );
};

export const App = () => (
    <AppWrapper>
        <Router>
            <Switch>
                <Route exact path="/">
                    <Demo />
                </Route>
            </Switch>
        </Router>
    </AppWrapper>
);
