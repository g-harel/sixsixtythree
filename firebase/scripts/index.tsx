import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "normalize.css";
import React from "react";
import ReactDOM from "react-dom";

import {App} from "./App";

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

ReactDOM.render(<App />, document.getElementById("react-root"));
