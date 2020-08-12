const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
exports.initializeApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://kiddos-app-c0029.firebaseio.com",
    storageBucket: "gs://kiddos-app-c0029.appspot.com"
});