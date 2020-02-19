import firebase from "firebase/app";
import {useState, useEffect} from "react";

import {useAuth} from "./auth";

export interface Project {
    id: string;
    title?: string;
    description?: string;
    owners?: string[];
    readers?: string[];
}

const removeDuplicates = (from: Project[], filter: Project[]): Project[] => {
    const foundIds: Record<string, string> = {};
    filter.forEach(({id}) => (foundIds[id] = "found"));
    return from.slice().filter(({id}) => !foundIds[id]);
};

export const useProjectData = (): [Project[], Project[]] => {
    const [user] = useAuth();
    const [owner, setOwner] = useState<Project[]>([]);
    const [reader, setReader] = useState<Project[]>([]);

    useEffect(() => {
        if (!user) {
            setOwner([]);
            setReader([]);
            return;
        }

        const ref = firebase.firestore().collection("projects");

        const genHandler = (setter: (projects: Project[]) => void) => {
            return (snapshot: firebase.firestore.QuerySnapshot) =>
                setter(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    })),
                );
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
    }, [user]);

    return [owner, removeDuplicates(reader, owner)];
};
