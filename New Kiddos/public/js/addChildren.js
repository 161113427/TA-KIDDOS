import { auth, db } from './auth.js';
import '../css/style.css'

$(document)
    .ready(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                $(".nama")
                    .text(user.displayName);
                if (user.photoURL != null) {
                    $('.image-profile')
                        .attr('src', user.photoURL)
                } else {
                    $('.image-profile')
                        .attr('src', '../image/social.svg');
                }
                if (user.emailVerified) {
                    $('#kirimVerifikasi')
                        .submit((e) => {
                            const verifCode = Math.floor((Math.random() * 899999) + 100000)
                                .toString()

                            fetch('/addChildren', {
                                    method: "POST",
                                    headers: {
                                        Accept: "application/json",
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        kodeVerifikasi: verifCode,
                                        emailAnak: $('#email-anak')
                                            .val()
                                    })
                                })
                                .then((response) => {
                                    return response.json();
                                })
                                .then((responseJson) => {
                                    if (responseJson.status == 400) {
                                        alert('Tidak bisa menambahkan akun orang tua');
                                    }
                                    if (responseJson.status == 404) {
                                        alert('Akun Anak Belum Terdaftar');
                                    }
                                    if (responseJson.status == 200) {
                                        return window.location.assign('/verificationChildren');
                                    }
                                })

                            e.preventDefault();
                        })
                } else {}
            } else {
                return window.location.assign('/login');
            }
        });

    })
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