import "../css/style.css"
import { auth, db } from "./auth.js"
import { registerViewAdjust } from "./view-adjust.js"

$(document)
    .ready(function () {
        $("#register")
            .submit((event) => {
                $(".modal-footer")
                    .html(`<div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>`)
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
                                    .then(() => {
                                        db.collection('User')
                                            .doc($('#user-email')
                                                .val()
                                                .toLowerCase())
                                            .collection('Pengaturan')
                                            .doc('Perekaman')
                                            .set({ durasiPerekaman: 1, waktuDimutakhirkan: Date.now() });
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
                            $(".modal-footer")
                                .html(`<input class="btn btn-primary w-100 rounded-pill mt-n3" type="submit" value="Masuk" id="Login"></input>`)
                        });
                } else {
                    if ($('#user-password')
                        .val() !== $('#user-re-password')
                        .val()) {
                        alert('Password tidak sesuai');
                    }
                    alert('Pendaftaran akun gagal');
                    $(".modal-footer")
                        .html(`<input class="btn btn-primary w-100 rounded-pill" type="submit" value="Buat Akun" id="regis"></input>`);
                }
                event.preventDefault();
            });
    });
registerViewAdjust();