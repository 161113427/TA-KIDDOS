const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
exports.initializeApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://kiddos-724ae.firebaseio.com",
    storageBucket: "gs://kiddos-724ae.appspot.com"
});