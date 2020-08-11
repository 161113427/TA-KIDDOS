const functions = require('firebase-functions');
const admin = require('firebase-admin');
const path = require('path');
const os = require('os');
const fs = require('fs');
const ss = require('./algo.js');
const initializeApp = require('./initializeApp.js');
initializeApp.initializeApp;

const storage = admin.storage()
    .bucket();

exports.encryptFile = functions.https.onCall((data) => {
    const filePath = data.name;
    const finalPath = filePath.split('/')
        .slice(0, 5)
        .join('/');
    const fileName = path.basename(filePath);
    const tempFilePath = path.join(os.tmpdir(), fileName);
    //download file yang telah terupload untuk di enkripsi
    async() => {
        await storage.file(filePath)
            .download({ destination: tempFilePath })
            .then(() => {
                console.log('File telah terdownload ke ', tempFilePath);
                const hexVal = ss.getByteArray(tempFilePath);
                ss.reconstructByteArrayToEncrypt(ss.generateHexFromBinToEncrypt(hexVal), fileName.split('.')
                        .slice(0, 1))
                    .catch((error) => {
                        // Re-throwing the error as an HttpsError so that the client gets the error details.
                        throw new functions.https.HttpsError('process failure', error.message, error);
                    });
            })
            .then(() => {
                for (let i = 0; i < Math.pow(2, 2); i++) {
                    const name = fileName.split('.')
                        .slice(0, 1);
                    const encryptFileName = `encrypted_${name}_${i}.bin`;
                    const encryptFilePath = finalPath + "/" + encryptFileName;

                    storage.upload(path.join(os.tmpdir(), `${encryptFileName}`), {
                            destination: encryptFilePath
                        })
                        .catch((error) => {
                            // Re-throwing the error as an HttpsError so that the client gets the error details.
                            throw new functions.https.HttpsError('upload failure', error.message, error);
                        });
                }
            })
            .then(() => {
                storage.file(filePath)
                    .delete();
            })
            .catch((error) => {
                // Re-throwing the error as an HttpsError so that the client gets the error details.
                throw new functions.https.HttpsError('unknown', error.message, error);
            });

        // File sudah di upload, file di direktori temp dihapus
        fs.unlinkSync(tempFilePath);
        return { status: "success" };
    }
});