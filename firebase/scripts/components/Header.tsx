import React from "react";
import styled from "styled-components";

import {useAuth, login} from "../internal/auth";
import {Link} from "react-router-dom";

const HeaderWrapper = styled.div`
    align-items: center;
    display: flex;
    flex-direction: row;
    padding: 2rem 2.2rem;
`;

const CustomContent = styled.div`
    flex-grow: 1;
`;

const AlwaysContent = styled.div`
    display: flex;
    flex-direction: column;
`;

const LogoPlaceholder = styled.div`
    background-color: ${(p) => p.theme.colors.backgroundShadow};
    border-radius: 0.2rem;
    height: 3rem;
    width: 6rem;
`;

const ProfileIcon = styled(Link)`
    align-items: center;
    background-color: ${(p) => p.theme.colors.card};
    border-radius: ${(p) => p.theme.colors.cardCornerRadius};
    border: 1px solid ${(p) => p.theme.colors.cardBorder};
    color: ${(p) => p.theme.colors.cardText};
    cursor: pointer;
    display: flex;
    font-family: ${(p) => p.theme.fonts.titleFamily};
    font-size: ${(p) => p.theme.fonts.titleSize};
    font-weight: ${(p) => p.theme.fonts.titleWeight};
    height: 3rem;
    justify-content: center;
    text-decoration: none;
    text-transform: uppercase;
    user-select: none;
    width: 3rem;

    &:hover {
        background-color: ${(p) => p.theme.colors.cardHover};
        border-color: ${(p) => p.theme.colors.cardHoverBorder};
    }
`;

export const Header: React.FunctionComponent = (props) => {
    const [user] = useAuth();

    if (!user) {
        return (
            <HeaderWrapper>
                <AlwaysContent>
                    <LogoPlaceholder />
                </AlwaysContent>
                <CustomContent>{props.children}</CustomContent>
                <AlwaysContent>
                    <button onClick={login}>login</button>
                </AlwaysContent>
            </HeaderWrapper>
        );
    }

    const profileLetter = (user.email || "!")[0];

    return (
        <HeaderWrapper>
            <AlwaysContent>
                <LogoPlaceholder />
            </AlwaysContent>
            <CustomContent>{props.children}</CustomContent>
            <AlwaysContent>
                <ProfileIcon to="/me">{profileLetter}</ProfileIcon>
            </AlwaysContent>
        </HeaderWrapper>
    );
};
