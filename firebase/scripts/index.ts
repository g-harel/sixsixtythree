import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";

firebase.initializeApp({
    apiKey: "AIzaSyDeQC-oMFkcqUt7XhZHgrdm91WKbTk73Sw",
    authDomain: "sixsixtythree-edf10.firebaseapp.com",
    databaseURL: "https://sixsixtythree-edf10.firebaseio.com",
    projectId: "sixsixtythree-edf10",
    storageBucket: "sixsixtythree-edf10.appspot.com",
    messagingSenderId: "278486851289",
    appId: "1:278486851289:web:1becd8a66c988420b628c8",
    measurementId: "G-ZXHFKP73LV",
});

const findOrDie = <T>(selector: string): T => {
    const element = document.querySelector(selector);
    if (element === null) {
        throw new Error("missing required element: " + selector);
    }
    return element as any;
};

const handleErr = (message: string) => {
    return (err: firebase.FirebaseError) => {
        console.error(message, JSON.stringify(err, null, 2));
    };
};

const loginButton = findOrDie<HTMLButtonElement>("#login");
const logoutButton = findOrDie<HTMLButtonElement>("#logout");
const userContainer = findOrDie<HTMLDivElement>("#user");
const textarea = findOrDie<HTMLTextAreaElement>("#text");

let unsubscribe = () => {};
const render = (user: firebase.User | null) => {
    if (user) {
        loginButton.style.display = "none";
        logoutButton.style.display = "block";
        userContainer.style.display = "block";
        textarea.style.display = "block";

        userContainer.innerHTML = user.displayName || user.email || "";

        unsubscribe = firebase
            .firestore()
            .collection("users")
            .doc(user.uid)
            .onSnapshot((doc) => {
                const data = doc.data();
                if (data) {
                    textarea.value = data.text;
                }
            });

        textarea.oninput = () => {
            firebase
                .firestore()
                .collection("users")
                .doc(user.uid)
                .set({text: textarea.value})
                .catch(handleErr("write data"));
        };
    } else {
        loginButton.style.display = "block";
        logoutButton.style.display = "none";
        userContainer.style.display = "none";
        textarea.style.display = "none";

        // Remove change listeners.
        unsubscribe();
        textarea.outerHTML = textarea.outerHTML;
    }
};

loginButton.onclick = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().useDeviceLanguage();
    firebase.auth().signInWithRedirect(provider);
};

logoutButton.onclick = () =>
    firebase
        .auth()
        .signOut()
        .then(() => console.log("signed out"))
        .catch(handleErr("sign out"));

firebase.auth().onAuthStateChanged((user) => render(user));
