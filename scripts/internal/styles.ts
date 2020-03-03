import {
    css,
    DefaultTheme,
    FlattenSimpleInterpolation,
    keyframes,
    ThemedStyledProps,
} from "styled-components";

const styled = {css, keyframes};

interface Styles {
    (props: ThemedStyledProps<{}, DefaultTheme>): FlattenSimpleInterpolation;
}

export const cardStyles: Styles = ({theme}) => styled.css`
    background-color: ${theme.colors.card};
    border-radius: ${theme.layout.cardCornerRadius};
    border: 1px solid ${theme.colors.cardBorder};
    color: ${theme.colors.cardText};
    cursor: pointer;
    transition: background-color 0.05s ease, border-color 0.05s ease;
    box-sizing: border-box;

    &:hover,
    &:active {
        background-color: ${theme.colors.cardHover};
        border-color: ${theme.colors.cardHoverBorder};
    }
`;

export const fadeInStyles = (
    delay: number = 0,
    duration: number = 0.25,
): Styles => {
    const fade = keyframes`
        0% {
            opacity: 0;
        }
        ${(delay / (delay + duration)) * 100 + "%"} {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    `;

    return () => styled.css`
        animation: ${fade} ease ${delay + duration}s;
    `;
};
