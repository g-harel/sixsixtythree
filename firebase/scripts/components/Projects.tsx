import React from "react";
import styled from "styled-components";

import {Header} from "./Header";
import {useAuth} from "../internal/auth";
import {useProjectData} from "../internal/projects";
import {ProjectSummary} from "./ProjectSummary";

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
    color: ${(p) => p.theme.colors.backgroundLightText};
    font-family: ${(p) => p.theme.fonts.titleFamily};
    font-size: ${(p) => p.theme.fonts.titleSize};
    font-weight: ${(p) => p.theme.fonts.titleWeight};
    margin: 0;
    padding-left: 2rem;
`;

const ProjectList = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
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
                                <ProjectSummary {...project} />
                            </li>
                        ))}
                    </ProjectList>
                </ProjectColumn>
                <ProjectColumn>
                    <ProjectListTitle>Shared With Me</ProjectListTitle>
                    <ProjectList>
                        {readerProjects.map((project) => (
                            <li key={project.id}>
                                <ProjectSummary {...project} />
                            </li>
                        ))}
                    </ProjectList>
                </ProjectColumn>
            </ProjectsWrapper>
        </>
    );
};
