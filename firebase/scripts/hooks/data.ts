import firebase from "firebase/app";
import {useState, useEffect} from "react";
import {useAuth} from "./auth";

export interface IData {
    text: string;
}

export const useData = (): [IData | null, (data: IData) => void] => {
    const [user] = useAuth();
    const [data, setData] = useState<IData | null>(null);

    useEffect(() => {
        if (!user) return;

        const handleDoc = (doc: firebase.firestore.DocumentSnapshot) => {
            setData((doc.data() as IData) || null);
        };

        const unsubscribe = firebase
            .firestore()
            .collection("users")
            .doc(user.uid)
            .onSnapshot(handleDoc);
        return unsubscribe;
    }, [user]);

    const persistData = (d: IData) => {
        if (!user) return;

        // TODO handle errors.
        firebase
            .firestore()
            .collection("users")
            .doc(user.uid)
            .set(d);
    };

    return [data, persistData];
};
