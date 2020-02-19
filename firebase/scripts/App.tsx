import React from "react";
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";
import styled from "styled-components";

import {Projects} from "./components/Projects";
import {Tasks} from "./components/Tasks";

const AppWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

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
                <Route>
                    There has been a terrible mistake.
                    <Link to="/">I'm scared</Link>
                    <Link
                        to={({pathname}) =>
                            `${pathname}/${Math.floor(Math.random() * 1e8)}`
                        }
                    >
                        I want to go deeper
                    </Link>
                </Route>
            </Switch>
        </BrowserRouter>
    </AppWrapper>
);
