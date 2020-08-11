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
                    const hexVal = ss.getByteArray(tempFilePath);
                    ss.reconstructByteArrayToEncrypt(ss.generateHexFromBinToEncrypt(hexVal), fileName.split('.')
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