import React from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";

import {useAuth, login} from "../internal/auth";
import {cardStyles, fadeInStyles} from "../internal/styles";

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
    ${fadeInStyles()}
    background-color: ${(p) => p.theme.colors.backgroundShadowStack};
    border-radius: 0.2rem;
    height: 3rem;
    width: 6rem;
`;

const ProfileIcon = styled(Link)`
    ${cardStyles}
    ${fadeInStyles()}
    align-items: center;
    display: flex;
    font-family: ${(p) => p.theme.fonts.titleFamily};
    font-size: ${(p) => p.theme.fonts.titleSize};
    font-weight: ${(p) => p.theme.fonts.titleWeight};
    height: 3rem;
    justify-content: center;
    text-decoration: none;
    user-select: none;
    width: 3rem;
`;

export const Header: React.FunctionComponent = (props) => {
    const [user, authLoading] = useAuth();

    if (authLoading) {
        return (
            <HeaderWrapper>
                <AlwaysContent>
                    <LogoPlaceholder />
                </AlwaysContent>
                <CustomContent>{props.children}</CustomContent>
                <AlwaysContent></AlwaysContent>
            </HeaderWrapper>
        );
    }

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

    const profileLetter = (user.email || "!")[0].toLocaleUpperCase();

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
