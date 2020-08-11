import "../css/style.css"
import { auth, db } from "./auth.js"
import { registerViewAdjust } from "./view-adjust.js"

$(document)
    .ready(function () {
        $("#register")
            .submit((event) => {
                if ($('input[name="agreement"]')
                    .is(":checked") && $('#user-password')
                    .val() === $('#user-re-password')
                    .val()) {
                    auth.createUserWithEmailAndPassword($("#user-email")
                            .val()
                            .toLowerCase(), $("#user-password")
                            .val())
                        .then(() => {
                            if ($('input[name="statusRadio"]:checked')
                                .val() === "orangtua") {
                                return db.collection('User')
                                    .doc($('#user-email')
                                        .val()
                                        .toLowerCase())
                                    .set({
                                        email: $('#user-email')
                                            .val()
                                            .toLowerCase(),
                                        nama: $("#user-name")
                                            .val(),
                                        status: $("input[name='statusRadio']:checked")
                                            .val(),
                                        daftarAnak: []
                                    })
                            } else {
                                return db.collection('User')
                                    .doc($('#user-email')
                                        .val()
                                        .toLowerCase())
                                    .set({
                                        email: $('#user-email')
                                            .val()
                                            .toLowerCase(),
                                        nama: $("#user-name")
                                            .val(),
                                        status: $("input[name='statusRadio']:checked")
                                            .val(),
                                    })
                            }
                        })
                        .then(() => {
                            const user = auth.currentUser;
                            return user.updateProfile({
                                displayName: $("#user-name")
                                    .val(),
                                photoURL: '../image/social.svg'
                            });
                        })
                        .then(() => {
                            return window.location.assign('/verificationEmail');
                        })
                        .catch(function (error) {
                            alert(error.message);
                        });
                } else {
                    if ($('#user-password')
                        .val() !== $('#user-re-password')
                        .val()) {
                        alert('Password tidak sesuai');
                    }
                    alert('Pendaftaran akun gagal');
                }
                event.preventDefault();
            });
    });
registerViewAdjust();