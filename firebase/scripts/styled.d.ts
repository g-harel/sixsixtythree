import "styled-components";

declare module "styled-components" {
    export interface DefaultTheme {
        colors: {
            background: string;
            backgroundText: string;
            backgroundShadow: string;
            card: string;
            cardHover: string;
            cardBorder: string;
            cardText: string;
            cardLightText: string;
        };
    }
}
