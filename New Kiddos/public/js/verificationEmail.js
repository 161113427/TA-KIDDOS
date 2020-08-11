import { auth, db } from './auth.js';
import '../css/style.css'

firebase.auth.EmailAuthProvider.PROVIDER_ID;
$(document)
    .ready(() => {
        auth.onAuthStateChanged(function (user) {
            if (!user) {
                return window.location.assign('/login');
            } else {
                const verified = user.emailVerified;
                $('#name')
                    .text(user.email)
                if (!verified) {
                    user.sendEmailVerification()
                        .then(() => {
                            return alert('Periksa verifikasi di email Anda, setelah itu muat kembali halaman ini');
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
                if (verified) {
                    db.collection('User')
                        .doc(user.email)
                        .get()
                        .then(snap => {
                            if (snap.data()['status'] === 'anak') {
                                alert('Email Anda telah terverifikasi sebagai Anak, silakan gunakan aplikasi Android untuk menggunakan akun ini, karena aplikasi untuk anak tidak tersedia dalam format website');
                                auth.signOut()
                                    .then(() => {
                                        return window.location.assign('/');
                                    })
                            } else {
                                return window.location.assign('/addChildren');
                            }
                        })
                } else {
                    $('#kirimVerifikasi')
                        .click(() => {
                            user.sendEmailVerification()
                                .then(() => {
                                    return alert('Periksa verifikasi di email Anda, setelah itu muat kembali halaman ini');
                                })
                                .catch((err) => {
                                    console.log(err);
                                })
                        })
                    $('#signout')
                        .click(() => {
                            auth.signOut()
                                .then(() => {
                                    return window.location.assign('/login');
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                        })
                }
            }
        });

    });