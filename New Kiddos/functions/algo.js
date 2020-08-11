const path = require('path');
const os = require('os');
const fs = require('fs');
const { Buffer } = require('buffer');

function getByteArray(filePath) {
    let fileData = fs.readFileSync(filePath)
        .toString('hex');
    let result = []
    for (var i = 0; i < fileData.length; i += 2)
        result.push(fileData[i] + '' + fileData[i + 1])
    return result;
}
exports.getByteArray = function getByteArray(filePath) {
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

exports.generateHexFromBinToEncrypt = function generateHexFromBinToEncrypt(hexVal) {
    let videoHex = [];
    //generate Hexa dari biner
    encryptFiles(hexVal)
        .forEach(element => {
            videoHex.push(getVideoHex(element));
        });
    return videoHex;
}

exports.generateHexFromBinToDecrypt = function generateHexFromBinToDecrypt(hexVal) {
    let videoHex = [];
    //generate Hexa dari biner
    hexVal
        .forEach(element => {
            videoHex.push(getVideoHex(element));
        });
    return videoHex;
}


exports.reconstructByteArrayToEncrypt = function reconstructByteArrayToEncrypt(file, fileName) {
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
    // console.log(constructedFile.length);
    // return constructedFile;
}

exports.reconstructByteArrayToDecrypt = function reconstructByteArrayToDecrypt(file) {
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
            console.log('sukses simpan file');
        });
    });
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
exports.decryptFiles = function decryptFiles(file) {
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