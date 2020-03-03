import React, {useState} from "react";
import {Redirect} from "react-router-dom";
import styled from "styled-components";

import {Loader} from "./Loader";
import {useAuth, logout} from "../internal/auth";
import {cardStyles, fadeInStyles} from "../internal/styles";

const Center = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    padding: 10% 2% 30%;
`;

const Title = styled.div`
    ${fadeInStyles()}
    font-family: ${(p) => p.theme.fonts.titleFamily};
    font-size: ${(p) => p.theme.fonts.titleSize};
    font-weight: ${(p) => p.theme.fonts.titleWeight};
`;

const Subtitle = styled.div`
    ${fadeInStyles(0.1)}
    color: ${(p) => p.theme.colors.backgroundLightText};
`;

const Button = styled.div`
    ${cardStyles}
    ${fadeInStyles(0.1)}
    font-weight: ${(p) => p.theme.fonts.mainWeightBold};
    margin-top: 2rem;
    padding: 1rem 2rem;
    user-select: none;
`;

export const Profile: React.FunctionComponent = () => {
    const [user, authLoading] = useAuth();
    const [redirect, setRedirect] = useState<string | null>(null);

    const onLogout = () => {
        setTimeout(() => {
            logout();
            setRedirect("/");
        }, 200);
    };

    if (authLoading)
        return (
            <Center>
                <Loader stack width="10rem" height="2rem" />
                <Loader margin="0.5rem" width="14rem" height="1rem" />
                <Loader margin="1.5rem" width="7rem" height="3rem" />
            </Center>
        );

    if (!user) return <Redirect to="/" />;

    return (
        <Center>
            <Title>{user.displayName || "Anonymous"}</Title>
            <Subtitle>{user.email || "Anonymous"}</Subtitle>
            <Button onClick={onLogout}>Logout</Button>
            {!!redirect && <Redirect to={redirect} />}
        </Center>
    );
};
