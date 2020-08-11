import "regenerator-runtime/runtime.js";
import { auth, db } from "./auth.js";
import { parentViewAdjust } from "./view-adjust.js"
import "./component/detail-app.js"
import "./component/video-app.js"
import "./component/location-app.js"
import "./component/settings-app.js"
import "../css/style.css";

const storage = firebase.storage();
const tambahDigit = (angka) => {
    if (angka <= 9)
        return "0" + angka;
    else
        return angka;
}
const videoAnak = (anak) => {
    return new Promise((resolve, reject) => {
        const videoBucket = storage.ref()
            .child(`${anak}/video`);
        return videoBucket
            .listAll()
            .then(function (data) {
                return resolve(data);
            })

    });
}

const createTopBox = (index) => {
    return `<div class="carousel-item" data-interval="9999999" id="dataAnak-${index}">
    <div class="bg-purple rounded-top">
        <div class="pt-3 pb-2 text-center">
            <div class="pb-2 text-white">
                <div id="namaAnak${index}"></div>
            </div>
        </div>
    </div>
    <div class="main-info d-flex mb-n4">    
        <div class="py-4 text-dark col-xl-5 text-left pl-4">
            <h6 class="fw-600 left-list pl-3">Dimutakhirkan Pada</h6>
            <p class="ml-3" id="lastUpdate${index}"></p>
            <h6 class="fw-600 left-list pl-3">Aplikasi Paling lama diakses</h6>
            <p class="ml-3" id="appPalingLamaDiakses${index}"></p>
            <h6 class="fw-600 left-list pl-3">Penggunaan Smartphone Hari Ini</h6>
            <p class="ml-3" id="penggunaanSmartphone${index}"></p>
            <h6 class="fw-600 left-list pl-3">Penggunaan Internet</h6>
            <p class="ml-3" id="penggunaanInternet${index}"></p>
        </div>
        <div class="py-lg-4 text-dark col-xl-7 text-left pl-4 pb-3">
            <h6 class="text-left"><strong>Riwayat Akses Aplikasi Hari Ini</strong></h6>
            <div class="list-history">
                <p class="row" id="history-${index}"></p>
            </div>
        </div>
    </div>
    <div class="list-feature d-flex row justify-content-center text-center">
        <div class="col-3 fitur py-2" id="detail${index}">
            <span class="card-link d-block">
                <div><ion-icon name="list-circle" class="fitur" id="list-app"></ion-icon></div>
                <div class="w-100 text-center feature-label">Detail Aplikasi</div>
            </span>
        </div>
        <div class="col-3 fitur py-2" id="video${index}">
            <span class="card-link">
                <div><ion-icon name="play-circle"></ion-icon></div>
                <div class="w-100 text-center feature-label">Video</div>
            </span>
        </div>
        <div class="col-3 fitur py-2" id="location${index}">
            <span class="card-link">
                <div><ion-icon name="location" class="fitur"></ion-icon></div>
                <div class="w-100 text-center feature-label">Lokasi</div>
            </span>
        </div>
        <div class="col-3 fitur py-2" id="settings${index}">
            <span class="card-link">
                <div><ion-icon name="options"></ion-icon></div>
                <div class="w-100 text-center feature-label">Pengaturan</div>
            </span>
        </div>
    </div>
</div>`
}

const riwayatAplikasi = (user, anak, index) => {
    //Riwayat Akses Aplikasi

    user.doc(anak)
        .collection("Riwayat Akses Aplikasi")
        .orderBy("waktuAkses", "desc")
        .limit(20)
        .onSnapshot((snap) => {
            try {
                snap.forEach((riwayatAkses) => {
                    const waktuAkses = new Date(riwayatAkses.data()["waktuAkses"]);
                    $(`#history-${index}`)
                        .append(`<div class="col-6">
                                    <p>${riwayatAkses.data()["namaAplikasi"]}</p>
                                </div>
                                <div class="col-6 d-flex">
                                    <ion-icon name="time" class="mr-2 pt-1"></ion-icon>
                                    <p>${waktuAkses.getHours()} : ${tambahDigit(waktuAkses.getMinutes())} </p>
                                </div>
                            `);
                });
            } catch {}
        })

    //End-Riwayat Aplikasi
}

const renderDataAnak = (user, anak, index, uid) => {
    const detailPenggunaanAplikasi = new Promise((resovle, reject) => {
        return user.doc(anak)
            .collection("Detail Penggunaan")
            .onSnapshot((snap) => {
                let dataset = [];
                try {
                    if (snap.empty) {
                        return resovle({ dataset: dataset, user: user, anak: anak, msg: "kosong" });
                    } {
                        snap.forEach((detail) => {
                            const iconApp = storage.ref()
                                .child(`${anak}/iconApp/`);
                            iconApp.child(detail.data()['namaPaketAplikasi'] + '.png')
                                .getDownloadURL()
                                .then(icon => {
                                    dataset.push({ namaApp: detail.data()['namaAplikasi'], durasi: detail.data()['durasiPenggunaan'], internet: detail.data()['penggunaanInternet'], namaPaket: detail.data()['namaPaketAplikasi'], icon: icon });
                                    return resovle({ dataset: dataset, user: user, anak: anak, msg: "berisi" });
                                });
                        });
                    }
                } catch {}
            })
    });
    const daftarAplikasi = new Promise((resovle, reject) => {
        return user.doc(anak)
            .collection("Daftar Aplikasi")
            .onSnapshot((snap) => {
                let dataset = [];
                try {
                    if (snap.empty) {
                        return resovle({ dataset: dataset, user: user, anak: anak, msg: "kosong" });
                    } else {
                        snap.forEach((aplikasi) => {
                            const iconApp = storage.ref()
                                .child(`${anak}/iconApp/`);
                            iconApp.child(aplikasi.data()['namaPaketAplikasi'] + '.png')
                                .getDownloadURL()
                                .then(icon => {
                                    dataset.push({ namaApp: aplikasi.data()['namaAplikasi'], namaPaket: aplikasi.data()['namaPaketAplikasi'], icon: icon });
                                    return resovle({ dataset: dataset, user: user, anak: anak, msg: "berisi" });
                                });
                        });
                    }
                } catch {}
            });
    });


    riwayatAplikasi(user, anak, index);

    $(".carousel-inner")
        .append(createTopBox(index));
    parentViewAdjust();
    user.doc(anak)
        .get()
        .then((snap) => {
            const namaAnak = snap.data()['nama'].split(" ")
                .join("");
            const jam = snap.data()['totalDurasiPenggunaanSmartphone'] / 3600 / 1000;
            const jamUpdate = new Date(snap.data()['timestampPemutakhiranData'])
                .getHours();
            const menitUpdate = new Date(snap.data()['timestampPemutakhiranData'])
                .getMinutes();
            const tglUpdate = new Date(snap.data()['timestampPemutakhiranData'])
                .getDate();
            const blnUpdate = new Date(snap.data()['timestampPemutakhiranData'])
                .getMonth();
            const thnUpdate = new Date(snap.data()['timestampPemutakhiranData'])
                .getFullYear();
            const menit = Math.floor(jam * 60 % 60);
            try {
                isNaN(jamUpdate) ?
                    $(`#lastUpdate${index}`)
                    .text(`Belum ada data untuk ditampilkan`) :
                    $(`#lastUpdate${index}`)
                    .text(`${tglUpdate}/${blnUpdate}/${thnUpdate}, Pukul ${jamUpdate}:${menitUpdate}`);
            } catch {}
            try {
                $(`#appPalingLamaDiakses${index}`)
                    .append(`<p>${snap.data()['appPalingLamaDiakses'][0]}</p>`);
            } catch {
                $(`#appPalingLamaDiakses${index}`)
                    .append(`<p>Belum ada data untuk ditampilkan</p>`);
            }
            try {
                isNaN(Math.floor(jam)) ?
                    $(`#penggunaanSmartphone${index}`)
                    .text(`Belum ada data untuk ditampilkan`) :
                    $(`#penggunaanSmartphone${index}`)
                    .text(`${Math.floor(jam)} Jam ${menit} Menit`);
            } catch {}
            try {
                isNaN(snap.data()['totalPenggunaanInternet'] / 1000000) ?
                    $(`#penggunaanInternet${index}`)
                    .text(`Belum ada data untuk ditampilkan`) :
                    $(`#penggunaanInternet${index}`)
                    .text(`${(snap.data()['totalPenggunaanInternet']/1000000).toFixed(2)} MB`);
            } catch {}

            $(`#namaAnak${index}`)
                .text(snap.data()['nama']);
            $(`#detail${index}`)
                .click(() => {
                    const detailApp = document.createElement("detail-app");
                    detailApp.setAttribute('id', `detail${namaAnak}`);

                    detailPenggunaanAplikasi
                        .then(data => {
                            detailApp.detailAplikasi = data;
                        });
                    $('.detailPenggunaan')
                        .html(detailApp);
                    $('location-app')
                        .remove();
                    $('video-app')
                        .remove();
                    $('settings-app')
                        .remove();
                    $(`#detail${index}`)
                        .addClass('menu-active');
                    $(`#location${index}`)
                        .removeClass('menu-active');
                    $(`#video${index}`)
                        .removeClass('menu-active');
                    $(`#settings${index}`)
                        .removeClass('menu-active');
                });
            $(`#video${index}`)
                .click(() => {
                    const listVideo = document.createElement("video-app");
                    listVideo.setAttribute('id', `video${namaAnak}`);
                    videoAnak(anak)
                        .then(data => {
                            return listVideo.dataVideo = { data: data, uid: uid };
                        })
                    $('.video')
                        .html(listVideo);
                    $('location-app')
                        .remove();
                    $('detail-app')
                        .remove();
                    $('settings-app')
                        .remove();
                    $(`#video${index}`)
                        .addClass('menu-active');
                    $(`#location${index}`)
                        .removeClass('menu-active');
                    $(`#detail${index}`)
                        .removeClass('menu-active');
                    $(`#settings${index}`)
                        .removeClass('menu-active');
                });
            $(`#location${index}`)
                .click(() => {
                    user.doc(anak)
                        .collection('Lokasi')
                        .onSnapshot(lokasi => {
                            const lokasiAnak = document.createElement('location-app');
                            lokasiAnak.setAttribute('id', `map${namaAnak}`);
                            if (lokasi.empty) {
                                lokasiAnak.data = { namaAnak: snap.data()['nama'], lng: -101.073324, lat: 38.685516, updateTime: 0 };
                            } else {
                                lokasi.forEach(e => {
                                    lokasiAnak.data = { namaAnak: snap.data()['nama'], lng: e.data()['long'], lat: e.data()['lat'], updateTime: e.data()['waktuDimutakhirkan'] };
                                })
                            }
                            $('.lokasi')
                                .html(lokasiAnak)
                            $('detail-app')
                                .remove();
                            $('video-app')
                                .remove();
                            $('settings-app')
                                .remove();
                            $(`#location${index}`)
                                .addClass('menu-active');
                            $(`#detail${index}`)
                                .removeClass('menu-active');
                            $(`#video${index}`)
                                .removeClass('menu-active');
                            $(`#settings${index}`)
                                .removeClass('menu-active');
                        });
                });
            $(`#settings${index}`)
                .click(() => {
                    const settingsApp = document.createElement("settings-app");
                    settingsApp.setAttribute('id', `settings${namaAnak}`);

                    daftarAplikasi
                        .then(data => {
                            settingsApp.listAplikasi = data;
                        });
                    $('.settings')
                        .html(settingsApp);
                    $('detail-app')
                        .remove();
                    $('location-app')
                        .remove();
                    $('video-app')
                        .remove();
                    $(`#settings${index}`)
                        .addClass('menu-active');
                    $(`#detail${index}`)
                        .removeClass('menu-active');
                    $(`#location${index}`)
                        .removeClass('menu-active');
                    $(`#video${index}`)
                        .removeClass('menu-active');
                });
        })

}


parentViewAdjust();
auth.onAuthStateChanged((user) => {
    if (!user) {
        return window.location.assign("/login");
    } else {
        if (user.emailVerified) {
            $(document)
                .ready(() => {
                    const dataUser = db.collection("User");
                    const dataOrangTua = dataUser.doc(user.email);
                    let daftarAnak = [];
                    //Get name by displayName authentication
                    $(".nama")
                        .text(user.displayName);
                    user.photoURL != '' ? $('.image-profile')
                        .attr('src', user.photoURL) : $('.image-profile')
                        .attr('src', '../image/social.svg');
                    try {
                        //Get name by firestore database
                        // dataOrangTua
                        //     .get()
                        //     .then((snap) => {
                        //         $("#namaOrtu")
                        //             .text(snap.data()["nama"]);
                        //     });
                        setTimeout(() => {
                            //GET Children by Collection 'Daftar Anak'
                            dataOrangTua.collection('Daftar Anak')
                                .get()
                                .then(snap => {
                                    !snap.empty ? snap.forEach((dataAnak, index) => {
                                        daftarAnak.push(dataAnak.data()['email']);
                                    }) : 0
                                })
                                .then(() => {
                                    daftarAnak.length != 0 ? daftarAnak.forEach((dataAnak, index) => {
                                            renderDataAnak(dataUser, dataAnak, index + 1, user.uid);
                                        }) : $(".carousel.slide")
                                        .append(`<div class="w-100 h-100 d-flex justify-content-center align-items-center"><h4>Belum ada anak yang terdaftar</h4><div>`);
                                });
                            //Get Children by Array daftarAnak
                            // dataOrangTua.onSnapshot((snap) => {
                            //     const daftarAnak = snap.data()["daftarAnak"];
                            //     if (daftarAnak.length != 0)
                            //         daftarAnak.forEach((dataAnak, index) => {
                            //             renderDataAnak(dataUser, dataAnak, index + 1, user.uid);
                            //         });
                            //     else {
                            //         $(".carousel.slide")
                            //             .append(`<div class="w-100 h-100 d-flex justify-content-center align-items-center"><h4>Belum ada anak yang terdaftar</h4><div>`);
                            //     }
                            // });
                        }, 1000);
                    } catch {}
                });
        } else {
            return window.location.assign('/verificationEmail');
        }
    }
});

const signOut = () => {
    auth.signOut()
        .then(() => {
            return window.location.assign("/login");
        })
        .catch((err) => {
            console.log(err);
        });
};
$(".signout")
    .click(() => { signOut(); });