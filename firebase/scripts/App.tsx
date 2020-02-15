import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import styled from "styled-components";

import {useAuth} from "./hooks/auth";
import {useData} from "./hooks/data";

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
    const [user, logout, login] = useAuth();
    const [data, setData] = useData();

    if (!user)
        return (
            <DemoWrapper>
                <button onClick={login}>login</button>
            </DemoWrapper>
        );

    const onChange = (event: React.FormEvent) => {
        setData({text: (event.target as HTMLTextAreaElement).value});
    };

    return (
        <DemoWrapper>
            <button onClick={logout}>logout</button>
            {user.displayName}
            <textarea onChange={onChange} value={data?.text}></textarea>
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
