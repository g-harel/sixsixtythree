import React, {useState} from "react";
import styled from "styled-components";

import {useAuth, login, logout} from "../internal/auth";

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
    align-self: flex-end;
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

const Logout = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    flex-shrink: 1;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s ease;
`;

const Profile = styled.div`
    background-color: transparent;
    border-radius: 0.3rem;
    display: flex;
    flex-direction: row-reverse;
    height: 3.5rem;
    margin: 0.5rem;
    overflow: hidden;
    transition: background-color 0.2s ease, border-color 0.2s ease, width 0.2s ease, height 0.2s ease;
    width: 3.5rem;

    &.open {
        background-color: #ffffff;
        width: 10rem;

        ${ProfileIcon} {
            border: 0.05rem solid #e6dcbd;
            margin: 0.45rem;
        }

        ${Logout} {
            opacity: 1;
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
                    <Logout>
                        <button onClick={logout}>logout</button>
                    </Logout>
                </Profile>
            </AlwaysContent>
        </HeaderWrapper>
    );
};
