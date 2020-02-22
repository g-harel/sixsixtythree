import React from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";

import {Header} from "./Header";
import {useAuth} from "../internal/auth";
import {useProjectData} from "../internal/projects";
import {removeDuplicates} from "../internal/utils";

const ProjectsWrapper = styled.div`
    display: flex;
    justify-content: center;
`;

const ProjectColumn = styled.div`
    margin: 2rem;
    padding: 2rem;
    width: 32rem;
`;

const ProjectListTitle = styled.h2`
    font-size: 1.6rem;
    font-weight: 900;
    margin: 0;
    padding-left: 2rem;
`;

const ProjectList = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
`;

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
    margin: 1rem 0;
`;

const ProjectUsers = styled.div`
    color: #968893;
    font-size: 0.8rem;
`;

const ProjectUsersLabel = styled.div`
    color: #302503;
    margin-bottom: 0.2rem;
`;

export const Projects: React.FunctionComponent = () => {
    const [user] = useAuth();
    const [ownerProjects, readerProjects] = useProjectData();

    if (!user) {
        return (
            <>
                <Header />
                <span>login to create your first project</span>
            </>
        );
    }

    return (
        <>
            <Header />
            <ProjectsWrapper>
                <ProjectColumn>
                    <ProjectListTitle>My Projects</ProjectListTitle>
                    <ProjectList>
                        {ownerProjects.map((project) => (
                            <li key={project.id}>
                                <ProjectItem to={`/${project.id}`}>
                                    <ProjectTitle>
                                        {project.title ||
                                            `project-${project.id}`}
                                    </ProjectTitle>
                                    <ProjectUsers>
                                        {(project.owners || []).join(", ")}
                                    </ProjectUsers>
                                    <ProjectDescription>
                                        {project.description}
                                    </ProjectDescription>
                                    <ProjectUsers>
                                        <ProjectUsersLabel>
                                            Shared with
                                        </ProjectUsersLabel>
                                        {removeDuplicates(
                                            project.readers || [],
                                            project.owners || [],
                                            (email) => email,
                                        ).join(", ")}
                                    </ProjectUsers>
                                </ProjectItem>
                            </li>
                        ))}
                    </ProjectList>
                </ProjectColumn>
                <ProjectColumn>
                    <ProjectListTitle>Shared With Me</ProjectListTitle>
                    <ProjectList>
                        {readerProjects.map((project) => (
                            <li key={project.id}>
                                <ProjectItem to={`/${project.id}`}>
                                    {project.title || `project-${project.id}`}
                                </ProjectItem>
                            </li>
                        ))}
                    </ProjectList>
                </ProjectColumn>
            </ProjectsWrapper>
        </>
    );
};
