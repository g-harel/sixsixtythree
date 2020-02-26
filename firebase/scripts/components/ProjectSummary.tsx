import React from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";

import {Project} from "../internal/projects";
import {removeDuplicates} from "../internal/utils";

const ProjectItem = styled(Link)`
    background-color: ${(p) => p.theme.colors.card};
    border-radius: ${(p) => p.theme.colors.cardCornerRadius};
    border: 1px solid ${(p) => p.theme.colors.cardBorder};
    color: ${(p) => p.theme.colors.cardText};
    display: block;
    height: 100%;
    margin-top: 2rem;
    padding: 2rem;
    text-decoration: none;
    transition: background-color 0.05s ease, border-color 0.05s ease;
    width: 100%;

    &:hover {
        background-color: ${(p) => p.theme.colors.cardHover};
        border-color: ${(p) => p.theme.colors.cardHoverBorder};
    }
`;

const ProjectTitle = styled.div`
    font-family: ${(p) => p.theme.fonts.titleFamily};
    font-size: ${(p) => p.theme.fonts.titleSize};
    font-weight: ${(p) => p.theme.fonts.titleWeight};
    margin: 0 0 0.2rem;
`;

const ProjectDescription = styled.div`
    margin: 1rem 0 0;
`;

const ProjectUsers = styled.div`
    color: ${(p) => p.theme.colors.cardLightText};
`;

const ProjectUsersLabel = styled.div`
    color: ${(p) => p.theme.colors.cardText};
    font-weight: ${(p) => p.theme.fonts.mainWeightBold};
    margin: 1rem 0 0.2rem;
`;

export const ProjectSummary: React.FunctionComponent<Project> = (project) => {
    const onlyReaders = removeDuplicates(
        project.readers || [],
        project.owners || [],
        (email) => email,
    );

    return (
        <ProjectItem to={`/${project.id}`}>
            <ProjectTitle>
                {project.title || `project-${project.id}`}
            </ProjectTitle>
            <ProjectUsers>{(project.owners || []).join(", ")}</ProjectUsers>
            <ProjectDescription>{project.description}</ProjectDescription>
            {!!onlyReaders.length && (
                <ProjectUsers>
                    <ProjectUsersLabel>Shared with</ProjectUsersLabel>
                    {onlyReaders.join(", ")}
                </ProjectUsers>
            )}
        </ProjectItem>
    );
};
