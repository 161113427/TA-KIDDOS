import { auth, db } from './auth.js';
import '../css/style.css'

$(document)
    .ready(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                if (user.emailVerified) {
                    $(".nama")
                        .text(user.displayName);
                    if (user.photoURL != null) {
                        $('.image-profile')
                            .attr('src', user.photoURL)
                    } else {
                        $('.image-profile')
                            .attr('src', '../image/social.svg');
                    }
                    $('#verifikasi')
                        .submit((e) => {
                            fetch('/verificationChildren', {
                                    method: "POST",
                                    headers: {
                                        Accept: "application/json",
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        kode: $("#kode")
                                            .val(),
                                    })
                                })
                                .then((res) => {
                                    return res.json();
                                })
                                .then((responseJson) => {
                                    if (responseJson.kode) {
                                        fetch('/addChildren', { method: "PUT", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ anak: responseJson.anak, ortu: user.email }) })
                                            .then(() => {
                                                return window.location.assign('/parent');
                                            });
                                    } else {
                                        alert('Kode verifikasi tidak sesuai');
                                    }
                                })

                            e.preventDefault();
                        })
                } else {}
            } else {
                return window.location.assign('/login');
            }
        });

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