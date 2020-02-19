import React from "react";
import {Link} from "react-router-dom";

import {Header} from "./Header";
import {useAuth} from "../internal/auth";
import {useProjectData} from "../internal/projects";

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
            <h2>Owner</h2>
            <ul>
                {ownerProjects.map((project) => (
                    <li key={project.id}>
                        <Link to={`/${project.id}`}>
                            {project.title || `project${project.id}`}
                        </Link>
                    </li>
                ))}
            </ul>
            <h2>Reader</h2>
            <ul>
                {readerProjects.map((project) => (
                    <li key={project.id}>
                        <Link to={`/${project.id}`}>
                            {project.title || `project-${project.id}`}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );
};
