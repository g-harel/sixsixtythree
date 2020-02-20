import React from "react";
import Modal from "react-modal";
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";
import styled, {createGlobalStyle} from "styled-components";
import {Normalize} from "styled-normalize";

import {Projects} from "./components/Projects";
import {Tasks} from "./components/Tasks";

Modal.setAppElement("#react-root");

const GlobalStyle = createGlobalStyle`
    html, body, #react-root {
        height: 100%;
    }
`;

const AppWrapper = styled.div`
    background-color: #fcf2d4;
    color: #302503;
    display: flex;
    font-family: "Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    height: 100%;
    flex-direction: column;
`;

export const App = () => (
    <AppWrapper>
        <Normalize />
        <GlobalStyle />
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
