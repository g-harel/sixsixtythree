import React from "react";
import styled from "styled-components";

import {Header} from "./Header";
import {Loader} from "./Loader";
import {ProjectSummary} from "./ProjectSummary";
import {useAuth} from "../internal/auth";
import {useProjectData} from "../internal/projects";
import {fadeInStyles} from "../internal/styles";

const ProjectsWrapper = styled.div`
    display: flex;
    justify-content: center;
`;

const ProjectColumn = styled.div`
    margin: 2rem;
    padding: 2rem;
    width: 32rem;
`;

const ProjectListTitle = styled.div`
    ${fadeInStyles()}
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

const ProjectListItem = styled.li`
    align-items: stretch;
    display: flex;
    flex-direction: column;
    height: 100%;
    margin-top: 2rem;
    width: 100%;
`;

export const Projects: React.FunctionComponent = () => {
    const [user, authLoading] = useAuth();
    const [projects, projectsLoading] = useProjectData();

    if (authLoading || projectsLoading) {
        return (
            <>
                <Header />
                <ProjectsWrapper>
                    <ProjectColumn>
                        <ProjectListTitle>My Projects</ProjectListTitle>
                        <ProjectList>
                            <ProjectListItem>
                                <Loader padding="2rem">
                                    <Loader stack width="60%" height="2rem" />
                                    <Loader stack margin="1rem" height="2rem" />
                                </Loader>
                            </ProjectListItem>
                            <ProjectListItem>
                                <Loader padding="2rem">
                                    <Loader stack width="80%" height="2rem" />
                                    <Loader stack margin="1rem" height="4rem" />
                                    <Loader
                                        stack
                                        margin="1rem"
                                        height="1.2rem"
                                    />
                                </Loader>
                            </ProjectListItem>
                            <ProjectListItem>
                                <Loader height="7rem" />
                            </ProjectListItem>
                        </ProjectList>
                    </ProjectColumn>
                    <ProjectColumn>
                        <ProjectListTitle>Shared With Me</ProjectListTitle>
                        <ProjectList>
                            <ProjectListItem>
                                <Loader padding="2rem">
                                    <Loader stack width="40%" height="2rem" />
                                    <Loader stack margin="1rem" height="6rem" />
                                </Loader>
                            </ProjectListItem>
                            <ProjectListItem>
                                <Loader height="9rem" />
                            </ProjectListItem>
                        </ProjectList>
                    </ProjectColumn>
                </ProjectsWrapper>
            </>
        );
    }

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
                        {projects
                            .filter((p) => p.isOwner)
                            .map((project) => (
                                <ProjectListItem key={project.id}>
                                    <ProjectSummary {...project} />
                                </ProjectListItem>
                            ))}
                    </ProjectList>
                </ProjectColumn>
                <ProjectColumn>
                    <ProjectListTitle>Shared With Me</ProjectListTitle>
                    <ProjectList>
                        {projects
                            .filter((p) => !p.isOwner)
                            .map((project) => (
                                <ProjectListItem key={project.id}>
                                    <ProjectSummary {...project} />
                                </ProjectListItem>
                            ))}
                    </ProjectList>
                </ProjectColumn>
            </ProjectsWrapper>
        </>
    );
};
