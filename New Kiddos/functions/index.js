const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const engines = require('consolidate');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { Buffer } = require('buffer');
const cors = require('cors');
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
        console.log('File Downloaded');
    }

    let encryptedFile = [];
    for (let i = 0; i < Math.pow(2, 2); i++) {
        const tempFilePath = path.join(os.tmpdir(), 'encrypted_' + nameApp + "_" + i + '.bin');
        encryptedFile.push(tempFilePath);
    }
    await reconstructByteArrayToDecrypt(generateHexFromBinToDecrypt(decryptFiles(encryptedFile)));

    await storage.upload(await path.join(os.tmpdir(), 'decryptedVideo.mp4'), { destination: filePath, metadata: { contentType: 'video/mp4' } })
        .then(responseUpload => {
            return responseUpload[0].getSignedUrl({ action: 'read', expires: '12-31-2030' })
        })
        .then(data => {
            return db.collection('Video Processing')
                .doc('processedVideo')
                .update({
                    [id]: data[0]
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
            return
        });
    res.status(200)
        .header('Content-Type', 'application/json')
        .header('Access-Control-Allow-Origin', '*')
        .header('Acces-Control-Allow-Headers', 'Content-Type')
        .json({ result: "Video Processed" });
    res.end();
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

// start encrypt
// ubah file asli ke hexa

function getByteArray(filePath) {
    let fileData = fs.readFileSync(filePath)
        .toString('hex');
    let result = []
    for (var i = 0; i < fileData.length; i += 2)
        result.push(fileData[i] + '' + fileData[i + 1])
    return result;
}
//fungsi hexa to biner
function hex2bin(hex) {
    return ("00000000" + (parseInt(hex, 16))
            .toString(2))
        .substr(-8);
}

//fungsi biner to hexa
function bin2hex(bin) {
    return ("00" + (parseInt(bin, 2))
            .toString(16))
        .substr(-2);
}

//mengambil bit dari biner
function getVideoBit(hexFile) {
    let result = []
    hexFile.forEach(hex => {
        result.push(hex2bin(hex));
    })
    return result;
}

//enkripsi file yang diupload dengan binary tree
function encryptFiles(filePath) {
    //deklarasi variabel split data
    const h = 2;
    let file = getVideoBit(filePath);
    let encryptFile = [file];
    let rnd = Math.round(Math.random() * 10);
    let result = [];
    //end

    //ravi
    while (result.length < Math.pow(2, h)) {
        result = [];
        for (let i = 0; i < encryptFile.length; i++) {
            let arrayBit1 = [];
            let arrayBit2 = [];
            // baca data olah
            encryptFile[i].forEach(bit => {
                let bitElement1 = "";
                let bitElement2 = "";
                for (let j = 0; j < 8; j++) {
                    //pecah data olah dengan menjadi 2 dan assign perBit ke setiap elemen data
                    let randomBoolean = Boolean(Math.round(Math.random()));
                    if (bit[j] == 0) {
                        if (randomBoolean) {
                            bitElement1 += '0';
                            bitElement2 += '0';
                        } else {
                            bitElement1 += '1';
                            bitElement2 += '1';
                        }
                    } else if (bit[j] == 1) {
                        if (randomBoolean) {
                            bitElement1 += '0';
                            bitElement2 += '1';
                        } else {
                            bitElement1 += '1';
                            bitElement2 += '0';
                        }
                    }
                }
                arrayBit1.push(bitElement1);
                arrayBit2.push(bitElement2);
            });
            result.push(arrayBit1, arrayBit2);
        }
        encryptFile = result;
    }
    return result;
    //end
}

//mengambil data hexa dari file biner
function getVideoHex(binaryFile) {
    let hexVideo = []
    binaryFile.forEach(bin => {
        hexVideo.push(bin2hex(bin));
    })
    return hexVideo;
}

function generateHexFromBinToEncrypt(hexVal) {
    let videoHex = [];
    //generate Hexa dari biner
    encryptFiles(hexVal)
        .forEach(element => {
            videoHex.push(getVideoHex(element));
        });
    return videoHex;
}

function generateHexFromBinToDecrypt(hexVal) {
    let videoHex = [];
    //generate Hexa dari biner
    hexVal
        .forEach(element => {
            videoHex.push(getVideoHex(element));
        });
    return videoHex;
}


function reconstructByteArrayToEncrypt(file, fileName) {
    let constructedFile = [];
    file.forEach(encrypted => {
        constructedFile.push(encrypted.toString()
            .split(',')
            .join(''));
    });
    //ini generate video
    let buffer;
    constructedFile.forEach((videoBytes, index) => {
        console.log(videoBytes.length);
        buffer = Buffer.from(videoBytes, "hex");
        fs.writeFile(path.join(os.tmpdir(), `encrypted_${fileName}_${index}.bin`), buffer, err => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('sukses simpan file');
        });
    });
}

function reconstructByteArrayToDecrypt(file) {
    let constructedFile = [];
    file.forEach(decrypted => {
        constructedFile.push(decrypted.toString()
            .split(',')
            .join(''));
    });
    //generate video
    let buffer;
    constructedFile.forEach((videoBytes, index) => {
        buffer = Buffer.from(videoBytes, "hex");
        fs.writeFile(path.join(os.tmpdir(), `decryptedVideo.mp4`), buffer, err => {
            if (err) {
                console.log(err);
                return;
            }
        });
    });
    console.log('sukses simpan file ke' + path.join(os.tmpdir()));
}

function declareEncryptedFileToDecrypt(file) {
    const hexVal1 = [];
    file.forEach(element => {
        hexVal1.push(getByteArray(element));
    });
    return hexVal1
}

function initializeFileToDecrypt(file) {
    let dataOlah = [];
    declareEncryptedFileToDecrypt(file)
        .forEach((element) => {
            dataOlah.push(getVideoBit(element));
        });
    return dataOlah;
}

//melakukan XOR data olah
function XOR_binaryFile(data1, data2) {
    try {
        let arrayXORResult = [];
        for (let i = 0; i < data1.length; i++) {
            let xor_result = "";
            for (let j = 0; j < 8; j++) {
                // If the Character matches 
                if (data1[i][j] == data2[i][j])
                    xor_result += "0";
                else
                    xor_result += "1";
            }
            arrayXORResult.push(xor_result)
        }
        return arrayXORResult;
    } catch {}
}

//membuat dekripsi file
function decryptFiles(file) {
    let dataOlah = initializeFileToDecrypt(file)
    let dataJadi;
    do {
        dataJadi = [];
        for (let i = 0; i < dataOlah.length; i += 2) {
            dataJadi.push(XOR_binaryFile(dataOlah[i], dataOlah[i + 1]));
        }
        dataOlah = dataJadi;
    } while (dataJadi.length != 1);
    return dataJadi;
}


exports.encryptFile = functions.storage.object()
    .onFinalize(async(object) => {
        const filePath = object.name;
        const finalPath = filePath.split('/')
            .slice(0, 5)
            .join('/');
        const fileName = path.basename(filePath);
        const tempFilePath = path.join(os.tmpdir(), fileName);
        //download file yang telah terupload untuk di enkripsi
        if (filePath.includes('encrypted') && fileName.startsWith("encrypted_") === false) {
            await storage.file(filePath)
                .download({ destination: tempFilePath })
                .then(() => {
                    console.log('File telah terdownload ke ', tempFilePath);
                    const hexVal = getByteArray(tempFilePath);
                    reconstructByteArrayToEncrypt(generateHexFromBinToEncrypt(hexVal), fileName.split('.')
                        .slice(0, 1));
                })
                .then(() => {
                    for (let i = 0; i < Math.pow(2, 2); i++) {
                        const name = fileName.split('.')
                            .slice(0, 1);
                        const encryptFileName = `encrypted_${name}_${i}.bin`;
                        const encryptFilePath = finalPath + "/" + encryptFileName;

                        storage.upload(path.join(os.tmpdir(), `${encryptFileName}`), {
                            destination: encryptFilePath
                        });
                    }
                })
                .then(() => {
                    storage.file(filePath)
                        .delete();
                });
            // File sudah di upload, file di direktori temp dihapus
            return fs.unlinkSync(tempFilePath);
        } else {
            return console.log('file sudah ada');
        }
    });

exports.app = functions.https.onRequest(app);
