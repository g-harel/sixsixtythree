import React, {useState} from "react";
import styled from "styled-components";

import {useAuth, login, logout} from "../internal/auth";

const transitionDurationSeconds = 0.2;

const HeaderWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const CustomContent = styled.div`
    flex-grow: 1;
`;

const AlwaysContent = styled.div`
    display: flex;
    flex-direction: column;
`;

const LogoPlaceholder = styled.div`
    background-color: #e6dcbd;
    border-radius: 0.2rem;
    height: 2.5rem;
    margin: 1rem;
    width: 6rem;
`;

const ProfileIcon = styled.div`
    align-items: center;
    background-color: #e6dcbd;
    border-radius: 0.2rem;
    display: flex;
    flex-shrink: 0;
    font-size: 1.5rem;
    font-weight: 900;
    height: 2.5rem;
    justify-content: center;
    justify-self: flex-start;
    margin: 0.5rem;
    text-transform: uppercase;
    user-select: none;
    width: 2.5rem;

    &:hover {
        cursor: pointer;
    }
`;

const LogoutWrapper = styled.div`
    align-items: center;
    border-radius: 0.2rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    margin-right: 0;
    margin: 0.45rem;
    min-width: 0;
    opacity: 0;
    overflow: hidden;
    padding: 0 0.5rem;
    pointer-events: none;
    transition: opacity ${transitionDurationSeconds / 2}s ease;

    &:hover {
        background-color: #eee;
        cursor: pointer;
    }
`;

const LogoutHint = styled.div`
    color: #665863;
    font-size: 1rem;
    font-weight: 900;
    text-transform: uppercase;
    white-space: nowrap;
`;

const LogoutEmail = styled.span`
    color: #968893;
    font-size: 0.7rem;
    font-weight: 700;
    max-width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
`;

const Profile = styled.div`
    background-color: transparent;
    border-radius: 0.3rem;
    display: flex;
    flex-direction: row-reverse;
    height: 3.5rem;
    margin: 0.5rem;
    transition: background-color ${transitionDurationSeconds}s ease,
        border-color ${transitionDurationSeconds}s ease,
        width ${transitionDurationSeconds}s ease,
        height ${transitionDurationSeconds}s ease;
    width: 3.5rem;

    &.open {
        background-color: #ffffff;
        width: 12em;

        ${ProfileIcon} {
            border: 0.05rem solid #e6dcbd;
            margin: 0.45rem;
        }

        ${LogoutWrapper} {
            opacity: 1;
            pointer-events: all;
            transition-delay: ${transitionDurationSeconds}s;
            transition-duration: ${transitionDurationSeconds / 2}s;
        }
    }
`;

export const Header: React.FunctionComponent = (props) => {
    const [user] = useAuth();
    const [isOpen, setIsOpen] = useState(false);

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

    const onLogout = () => {
        setTimeout(logout, 2 * transitionDurationSeconds * 1000);
        setIsOpen(false);
    };

    return (
        <HeaderWrapper>
            <AlwaysContent>
                <LogoPlaceholder />
            </AlwaysContent>
            <CustomContent>{props.children}</CustomContent>
            <AlwaysContent>
                <Profile className={isOpen ? "open" : ""}>
                    <ProfileIcon onClick={() => setIsOpen(!isOpen)}>
                        {profileLetter}
                    </ProfileIcon>
                    <LogoutWrapper onClick={onLogout}>
                        <LogoutHint>Sign Out</LogoutHint>
                        <LogoutEmail>{user.email}</LogoutEmail>
                    </LogoutWrapper>
                </Profile>
            </AlwaysContent>
        </HeaderWrapper>
    );
};
