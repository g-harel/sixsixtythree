function findOrDie(selector) {
    const element = document.querySelector(selector);
    if (element === null) {
        throw new Error("missing required element: " + selector);
    }
    return element;
}

function handleErr(message) {
    return function (err) {
        console.error(message, JSON.stringify(err, null, 2));
    }
}

var loginButton = findOrDie("#login");
var logoutButton = findOrDie("#logout");
var userContainer = findOrDie("#user");
var textarea = findOrDie("#text");

function render(user) {
    if (user) {
        loginButton.style.display = "none";
        logoutButton.style.display = "block";
        userContainer.style.display = "block";
        textarea.style.display = "block";

        userContainer.innerHTML = user.displayName;

        firebase.database().ref("users/" + user.uid + "/text").on("value", function(snapshot) {
            textarea.value = snapshot.val();
        });
        textarea.oninput = function() {
            firebase.database().ref("users/" + user.uid + "/text").set(textarea.value);
        }
    } else {
        loginButton.style.display = "block";
        logoutButton.style.display = "none";
        userContainer.style.display = "none";
        textarea.style.display = "none";

        // Remove change listener.
        textarea.outerHTML = textarea.outerHTML;
    }
}

loginButton.onclick = function () {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().useDeviceLanguage();
    firebase.auth().signInWithRedirect(provider);
};

logoutButton.onclick = function () {
    firebase.auth().signOut().then(function () {
        console.log("signed out");
    }).catch(handleErr("sign out"));
}

firebase.auth().onAuthStateChanged(function (user) {
    console.log(user);
    render(user);
});
