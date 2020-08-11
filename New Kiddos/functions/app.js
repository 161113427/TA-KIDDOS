const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const engines = require('consolidate');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const os = require('os');
const fs = require('fs');
const cors = require('cors');
const ss = require('./algo.js');
const initializeApp = require('./initializeApp.js');

initializeApp.initializeApp;

const app = express();
const storage = admin.storage()
    .bucket();
const db = admin.firestore();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: '*' }));

app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');
app.set('Access-Control-Allow-Origin', '*');

app.get('/', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-max=600');
    res.render('index');
});

app.get('/login', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-max=600');
    res.render('login');
});

app.get('/parent', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-max=600');
    res.render('parent');
});

app.post('/parent/video/:id', async(req, res) => {
    const id = req.params.id;
    const data = req.body.requestedURL;
    const [email, video, date, app] = data.split('/');
    const nameApp = app.split(':')
        .join('');
    const filePath = data + "/decrypted/decrypted_" + nameApp + '.mp4'
    for (let i = 0; i < Math.pow(2, 2); i++) {
        const tempFilePath = path.join(os.tmpdir(), 'encrypted_' + nameApp + "_" + i + '.bin');
        await storage.file(data + "/encrypted/encrypted_" + nameApp + '_' + i + '.bin')
            .download({
                destination: tempFilePath
            })
    }
    res.status(200)
        .header('Content-Type', 'application/json')
        .header('Access-Control-Allow-Origin', '*')
        .header('Acces-Control-Allow-Headers', 'Content-Type')
        .json({ result: "Video Processed" });
    res.end();
    let encryptedFile = [];
    for (let i = 0; i < Math.pow(2, 2); i++) {
        const tempFilePath = path.join(os.tmpdir(), 'encrypted_' + nameApp + "_" + i + '.bin');
        encryptedFile.push(tempFilePath);
    }
    await ss.reconstructByteArrayToDecrypt(ss.generateHexFromBinToDecrypt(ss.decryptFiles(encryptedFile)));

    await storage.upload(await path.join(os.tmpdir(), 'decryptedVideo.mp4'), { destination: filePath, metadata: { contentType: 'video/mp4' } })
        .then(responseUpload => {
            responseUpload[0].getSignedUrl({ action: 'read', expires: '12-31-2030' })
                .then(data => {
                    db.collection('Video Processing')
                        .doc('processedVideo')
                        .update({
                            [id]: data[0]
                        })
                        .then(() => {
                            db.collection('Video Processing')
                                .doc('requestedForProcessing')
                                .update({
                                    [id]: admin.firestore.FieldValue.delete()
                                });
                        });
                })
                .catch(err => {
                    res.header('Content-Type', 'application/json')
                        .json({ result: false, msg: err });
                    res.end();
                })
        })
        .then(() => {
            return fs.unlinkSync(path.join(os.tmpdir(), 'decryptedVideo.mp4'))
        })
        .then(() => {
            for (let i = 0; i < Math.pow(2, 2); i++) {
                const tempFilePath = path.join(os.tmpdir(), 'encrypted_' + nameApp + "_" + i + '.bin');
                fs.unlinkSync(tempFilePath)
            }
        });
});

app.get('/addChildren', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-max=600');
    res.render('addChildren');
})

app.get('/register', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-max=600');
    res.render('register');
});

app.get('/verificationEmail', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-max=600');
    res.render('verificationEmail');
})
app.post('/addChildren', (req, res) => {
    const kodeVerifikasi = req.body.kodeVerifikasi;
    const emailAnak = req.body.emailAnak;
    db.collection('User')
        .doc(emailAnak)
        .get()
        .then(snap => {
            if (snap.data()['status'] === 'anak') {
                db.collection('User')
                    .doc(emailAnak)
                    .update({
                        kodeVerifikasi: kodeVerifikasi
                    })
                    .then(() => {
                        res.cookie('emailVerif', emailAnak, { expires: new Date(Date.now() + 900000), httpOnly: true });
                        res.status(200)
                            .header("Content-Type", "application/json")
                            .json({ status: 200 });
                        res.end();
                    })
            } else {
                res.status(400)
                    .header("Content-Type", "application/json")
                    .json({ status: 400 });
            }
        })
        .catch((err) => {
            res.status(404)
                .header("Content-Type", "application/json")
                .json({ status: 404 });
        })
})
app.put('/addChildren', (req, res) => {
    const emailAnak = req.body.anak;
    db.collection('User')
        .doc(req.body.ortu)
        .get()
        .then((snap) => {
            let anak = [];
            anak = snap.get('daftarAnak');
            db.collection('User')
                .doc(emailAnak)
                .get()
                .then(snap => {
                    db.collection('User')
                        .doc(req.body.ortu)
                        .collection('Daftar Anak')
                        .doc(emailAnak)
                        .set({ email: emailAnak, nama: snap.data()['nama'] });
                });
            if (anak.length != 0) {
                if (!anak.includes(emailAnak)) {
                    anak.push(emailAnak);
                    db.collection('User')
                        .doc(req.body.ortu)
                        .update({ daftarAnak: anak })
                        .then(() => {
                            db.collection('User')
                                .doc(emailAnak)
                                .update({ kodeVerifikasi: "" })
                                .catch(err => {});
                        })
                        .catch(err => {});
                } else {}
            } else {
                anak.push(emailAnak);
                db.collection('User')
                    .doc(req.body.ortu)
                    .update({ daftarAnak: anak })
                    .catch(err => {
                        res.status(err.code)
                            .send(err.message)
                    });
            }
        })
    res.end();
})

app.post('/verificationChildren', (req, res) => {
    const kode = req.body.kode;
    db.collection('User')
        .doc(req.cookies.emailVerif)
        .get()
        .then((data) => {
            if (kode == data.data()['kodeVerifikasi'])
                res.status(200)
                .header("Content-Type", "application/json")
                .json({ kode: true, anak: req.cookies.emailVerif });
            else {
                res.header("Content-Type", "application/json")
                    .json({ kode: false })
            }
            res.end();
        })
})

app.get('/verificationChildren', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-max=600');
    res.render('verificationChildren');
})
app.get('/forgotPassword', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-max=600');
    res.render('forgotPassword');
})
app.get('/accountSettings', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-max=600');
    res.render('accountSettings');
});
exports.app = functions.https.onRequest(app);