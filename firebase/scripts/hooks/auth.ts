import firebase, {UserInfo} from "firebase/app";
import {useState, useEffect} from "react";

const login = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().useDeviceLanguage();
    firebase.auth().signInWithRedirect(provider);
};

const logout = () => {
    // TODO handle errors.
    firebase.auth().signOut();
};

export const useAuth = (): [UserInfo | null, typeof logout, typeof login] => {
    const [user, setUser] = useState<UserInfo | null>(null);

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(setUser);
        return unsubscribe;
    });

    return [user, logout, login];
};
