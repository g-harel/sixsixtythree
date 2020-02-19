import React from "react";
import styled from "styled-components";

import {useAuth, login, logout} from "../internal/auth";

const HeaderWrapper = styled.div`
    border-bottom: 1px solid #ccc;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0.5rem;
`;

const CustomContent = styled.div`
    background-color: red;
    flex-grow: 1;
`;

const AlwaysContent = styled.div``;

export const Header: React.FunctionComponent = (props) => {
    const [user] = useAuth();

    if (!user) {
        return (
            <HeaderWrapper>
                <CustomContent>{props.children}</CustomContent>
                <AlwaysContent>
                    <button onClick={login}>login</button>
                </AlwaysContent>
            </HeaderWrapper>
        );
    }

    return (
        <HeaderWrapper>
            <CustomContent>{props.children}</CustomContent>
            <AlwaysContent>
                <span>{user.email}</span>
                &nbsp;
                <button onClick={logout}>logout</button>
            </AlwaysContent>
        </HeaderWrapper>
    );
};
