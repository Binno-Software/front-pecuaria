import firebase from 'firebase';

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.APP_ID,
  projectId: process.env.AUTH_DOMAIN,
  storageBucket: process.env.BUCKET,
  messagingSenderId: process.env.MESSAGE_ID,
  appId: process.env.PROJECT_ID
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
