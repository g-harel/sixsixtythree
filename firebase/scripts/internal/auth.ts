import firebase, {UserInfo} from "firebase/app";
import {useState, useEffect} from "react";

export interface IUser extends UserInfo {}

export const login = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().useDeviceLanguage();
    firebase.auth().signInWithRedirect(provider);
};

export const logout = () => {
    // TODO handle errors.
    firebase.auth().signOut();
};

export const useAuth = (): [IUser | null] => {
    const [user, setUser] = useState<IUser | null>(null);

    useEffect(() => {
        // TODO handle errors.
        const unsubscribe = firebase.auth().onAuthStateChanged(setUser);
        return unsubscribe;
    });

    return [user];
};
