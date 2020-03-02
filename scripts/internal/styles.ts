import {DefaultTheme, ThemedStyledProps} from "styled-components";

// Template literal tag to trick dev tools into interpreting the string as css.
const styled = {
    css: (strings: TemplateStringsArray, ...expressions: any[]): string => {
        let out = strings[0];
        for (let i = 1; i < strings.length; i++) {
            out += expressions[i - 1];
            out += strings[i];
        }
        return out;
    },
};

interface Styles {
    (props: ThemedStyledProps<{}, DefaultTheme>): string;
}

export const cardStyles: Styles = ({theme}) => styled.css`
    background-color: ${theme.colors.card};
    border-radius: ${theme.colors.cardCornerRadius};
    border: 1px solid ${theme.colors.cardBorder};
    color: ${theme.colors.cardText};
    cursor: pointer;
    transition: background-color 0.05s ease, border-color 0.05s ease;

    &:hover {
        background-color: ${theme.colors.cardHover};
        border-color: ${theme.colors.cardHoverBorder};
    }
`;
