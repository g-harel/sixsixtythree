import React from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";

import {Project} from "../internal/projects";
import {removeDuplicates} from "../internal/utils";

const ProjectItem = styled(Link)`
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 0.3rem;
    border: 1px solid #e6dcbd;
    color: inherit;
    display: block;
    height: 100%;
    margin-top: 2rem;
    padding: 2rem;
    text-decoration: none;
    transition: background-color 0.05s ease, border-color 0.05s ease;
    width: 100%;

    &:hover {
        background-color: #ffffff;
        border-color: currentColor;
    }
`;

const ProjectTitle = styled.h3`
    font-weight: 900;
    margin: 0 0 0.2rem;
`;

const ProjectDescription = styled.div`
    margin: 1rem 0 0;
`;

const ProjectUsers = styled.div`
    color: #968893;
    font-size: 0.8rem;
`;

const ProjectUsersLabel = styled.div`
    color: #302503;
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
