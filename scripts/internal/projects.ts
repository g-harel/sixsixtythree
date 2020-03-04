import firebase from "firebase/app";
import {useState, useEffect} from "react";

import {useAuth} from "./auth";
import {removeDuplicates} from "./utils";

// TODO replace title with name
export interface Project {
    id: string;
    name?: string;
    description?: string;
    isOwner?: boolean;
    owners?: string[];
    readers?: string[];
}

export const useProjectData = (): [Project[], boolean] => {
    const [user, authLoading] = useAuth();
    const [loading, setLoading] = useState(true);
    const [owner, setOwner] = useState<Project[]>([]);
    const [reader, setReader] = useState<Project[]>([]);

    useEffect(() => {
        if (authLoading) {
            setLoading(true);
        }
        if (!authLoading && !user) {
            setLoading(false);
        }

        if (!user) {
            setOwner([]);
            setReader([]);
            return;
        }

        const ref = firebase.firestore().collection("projects");

        const genHandler = (setter: (projects: Project[]) => void) => {
            return (snapshot: firebase.firestore.QuerySnapshot) => {
                setter(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    })),
                );
                setLoading(false);
            };
        };

        // TODO handle errors.
        const unsubscribeOwner = ref
            .where("owners", "array-contains", user.email)
            .onSnapshot(genHandler(setOwner));
        const unsubscribeReader = ref
            .where("readers", "array-contains", user.email)
            .onSnapshot(genHandler(setReader));

        return () => {
            unsubscribeOwner();
            unsubscribeReader();
        };
    }, [user, authLoading]);

    const ownedProjects = owner.map((p) => {
        p.isOwner = true;
        return p;
    });

    const sharedProjects = removeDuplicates(reader, owner, ({id}) => id).map(
        (p) => {
            p.isOwner = false;
            return p;
        },
    );

    return [ownedProjects.concat(sharedProjects), loading];
};
