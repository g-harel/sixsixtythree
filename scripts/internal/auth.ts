import firebase, {UserInfo} from "firebase/app";
import {useState, useEffect} from "react";

export interface User extends UserInfo {}

export const login = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().useDeviceLanguage();
    firebase.auth().signInWithRedirect(provider);
};

export const logout = () => {
    // TODO handle errors.
    firebase.auth().signOut();
};

export const useAuth = (): [User | null, boolean] => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO handle errors.
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    return [user, loading];
};
