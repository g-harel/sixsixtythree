import React from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";

import {Project} from "../internal/projects";
import {cardStyles, fadeInStyles} from "../internal/styles";
import {removeDuplicates} from "../internal/utils";

const ProjectItem = styled(Link)`
    ${cardStyles}
    padding: 2rem;
    text-decoration: none;
`;

const ProjectName = styled.div`
    ${fadeInStyles()}
    font-family: ${(p) => p.theme.fonts.titleFamily};
    font-size: ${(p) => p.theme.fonts.titleSize};
    font-weight: ${(p) => p.theme.fonts.titleWeight};
    margin: 0 0 0.2rem;
`;

const ProjectDescription = styled.div`
    ${fadeInStyles(0.2)}
    margin: 1rem 0 0;
`;

const ProjectUsers = styled.div`
    ${fadeInStyles(0.1)}
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
            <ProjectName>
                {project.name || `project-${project.id}`}
            </ProjectName>
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
