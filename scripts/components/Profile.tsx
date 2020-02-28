import React, {useState} from "react";
import {Redirect} from "react-router-dom";
import styled from "styled-components";

import {useAuth, logout} from "../internal/auth";

const Center = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    padding: 10rem 2rem 30rem;
`;

const Title = styled.div`
    font-family: ${(p) => p.theme.fonts.titleFamily};
    font-size: ${(p) => p.theme.fonts.titleSize};
    font-weight: ${(p) => p.theme.fonts.titleWeight};
`;

const Subtitle = styled.div`
    color: ${(p) => p.theme.colors.backgroundLightText};
`;

const Button = styled.div`
    background-color: ${(p) => p.theme.colors.card};
    border-radius: ${(p) => p.theme.colors.cardCornerRadius};
    border: 1px solid ${(p) => p.theme.colors.cardBorder};
    color: ${(p) => p.theme.colors.cardText};
    cursor: pointer;
    font-weight: ${(p) => p.theme.fonts.mainWeightBold};
    margin-top: 2rem;
    padding: 1rem 2rem;
    user-select: none;

    &:hover {
        background-color: ${(p) => p.theme.colors.cardHover};
        border-color: ${(p) => p.theme.colors.cardHoverBorder};
    }
`;

export const Profile: React.FunctionComponent = () => {
    const [user] = useAuth();
    const [redirect, setRedirect] = useState<string | null>(null);

    const onLogout = () => {
        setTimeout(() => {
            logout();
            setRedirect("/");
        }, 200);
    };

    // TODO redirect if not logged, not if no auth state yet.
    // if (!user) return <Redirect to="/" />
    if (!user) return null;

    return (
        <Center>
            <Title>{user.displayName || "Anonymous"}</Title>
            <Subtitle>{user.email || "Anonymous"}</Subtitle>
            <Button onClick={onLogout}>Logout</Button>
            {!!redirect && <Redirect to={redirect} />}
        </Center>
    );
};
