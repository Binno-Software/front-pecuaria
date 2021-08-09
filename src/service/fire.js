import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDHYgBhNSF9ceEpMLbD-Zgyqn33gSGTQwQ",
    authDomain: "binno-software.firebaseapp.com",
    projectId: "binno-software",
    storageBucket: "binno-software.appspot.com",
    messagingSenderId: "816935504379",
    appId: "1:816935504379:web:3206e97a57f8c05aeaa35e"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();

const facebookProvider = new firebase.auth.FacebookAuthProvider();

export { auth, provider, facebookProvider };
