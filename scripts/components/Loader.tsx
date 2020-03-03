import React from "react";
import styled from "styled-components";

import {fadeInStyles} from "../internal/styles";

const Box = styled.div<LoaderProps>`
    ${fadeInStyles()}
    background-color: ${(p) =>
        p.stack
            ? p.theme.colors.backgroundShadowStack
            : p.theme.colors.backgroundShadow};
    border-radius: ${(p) => p.theme.layout.cardCornerRadius};
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: ${(p) => p.height};
    margin-top: ${(p) => p.margin};
    padding: ${(p) => p.padding};
    width: ${(p) => p.width || "100%"};
`;

export interface LoaderProps {
    height?: string;
    margin?: string;
    padding?: string;
    stack?: boolean;
    width?: string;
}

export const Loader: React.FunctionComponent<LoaderProps> = (props) => (
    <Box {...props}>{props.children}</Box>
);
