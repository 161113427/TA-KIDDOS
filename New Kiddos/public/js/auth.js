import { firebaseConfig } from "./firebaseConfig.js";

//Insialisasi firebaseApp
const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebaseApp.firestore();

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

export { auth, db };