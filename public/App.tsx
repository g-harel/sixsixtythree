import React from "react";
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";
import styled, {
    createGlobalStyle,
    DefaultTheme,
    ThemeProvider,
} from "styled-components";
import {Normalize} from "styled-normalize";

import {Profile} from "./components/Profile";
import {Projects} from "./components/Projects";
import {Tasks} from "./components/Tasks";
import {colorInterpolator} from "./internal/utils";

const themeColor = colorInterpolator("#fcf2d4", "#302503");

export const theme: DefaultTheme = {
    colors: {
        background: themeColor(0),
        backgroundText: themeColor(1),
        backgroundLightText: themeColor(0.5),
        backgroundShadow: themeColor(0.03),
        backgroundShadowStack: themeColor(0.07),
        card: themeColor(0),
        cardHover: themeColor(0.02),
        cardHoverBorder: themeColor(0.2),
        cardBorder: themeColor(0.1),
        cardText: themeColor(1),
        cardLightText: themeColor(0.7),
    },
    fonts: {
        mainFamily:
            "'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
        mainSize: "1rem",
        mainWeight: "400",
        mainWeightBold: "600",
        titleFamily:
            "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
        titleSize: "1.5rem",
        titleWeight: "900",
    },
    layout: {
        cardCornerRadius: "0.4rem",
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
    font-family: ${(p) => p.theme.fonts.mainFamily};
    height: 100%;
    flex-direction: column;
`;

const appendRandomPath = ({pathname}: {pathname: string}): string => {
    return `${pathname}/${Math.random()
        .toString(36)
        .substr(2, 5)}`;
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
                    <Route exact path="/me">
                        <Profile />
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
