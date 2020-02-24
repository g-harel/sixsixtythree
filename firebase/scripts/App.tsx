import React from "react";
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";
import styled, {
    createGlobalStyle,
    DefaultTheme,
    ThemeProvider,
} from "styled-components";
import {Normalize} from "styled-normalize";

import {Projects} from "./components/Projects";
import {Tasks} from "./components/Tasks";

export const theme: DefaultTheme = {
    colors: {
        background: "#fcf2d4",
        backgroundText: "#302503",
        backgroundShadow: "#e6dcbd",
        card: "rgba(255, 255, 255, 0.9)",
        cardHover: "#ffffff",
        cardBorder: "#e6dcbd",
        cardText: "#302503",
        cardLightText: "#968893",
    },
};

const GlobalStyle = createGlobalStyle`
    html, body, #react-root {
        height: 100%;
    }
`;

const AppWrapper = styled.div`
    background-color: ${(p) => p.theme.colors.background};
    color: ${(p) => p.theme.colors.backgroundText};
    display: flex;
    font-family: "Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    height: 100%;
    flex-direction: column;
`;

const appendRandomPath = ({pathname}: {pathname: string}): string => {
    return `${pathname}/${Math.random().toString(36).substr(2, 5)}`;
};

export const App = () => (
    <ThemeProvider theme={theme}>
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
                        <Link to={appendRandomPath}>I want to go deeper</Link>
                    </Route>
                </Switch>
            </BrowserRouter>
        </AppWrapper>
    </ThemeProvider>
);
