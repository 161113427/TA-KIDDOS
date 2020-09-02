import { auth, db } from "./auth.js";
import "../css/style.css";

$("#login")
    .submit((event) => {
        $(".modal-footer")
            .html(`<div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
        </div>`)
        let email = $("#user-email")
            .val()
            .toLowerCase();
        let password = $("#user-password")
            .val();
        if (email != "" && password != "") {
            const result = auth.signInWithEmailAndPassword(email, password);
            result.catch((err) => {
                switch (err.code) {
                case "auth/invalid-email" || "400":
                    {
                        alert("Email tidak ditemukan");
                        break;
                    }
                case "auth/user-not-found":
                    {
                        alert("email atau kata sandi yang Anda masukkan salah");
                        break;
                    }
                case "auth/wrong-password":
                    {
                        alert("email atau kata sandi yang Anda masukkan salah");
                        break;
                    }
                }
                $(".modal-footer")
                    .html(`<input class="btn btn-primary w-100 rounded-pill mt-n3" type="submit" value="Masuk"></input>`)
            });
        }
        event.preventDefault();
    });

$("#sendPasswordReset")
    .submit((e) => {
        $(".modal-footer")
            .html(`<div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
        </div>`)
        auth.sendPasswordResetEmail($('#forgot-email')
                .val())
            .then(function () {
                alert('Permintaan telah dikirim ke email Anda, silakan cek email Anda untuk menyetel ulang kata sandi');
                return window.location.assign('/');
            })
            .catch(function (error) {
                // An error happened.
                alert("Email Anda belum terdaftar");
                $(".modal-footer")
                    .html(`<input class="btn btn-primary w-100 rounded-pill mt-n3" type="submit" value="Kirim"></input>`)
            });
        e.preventDefault();
    });

$(document)
    .ready(() => {
        if ($(window)
            .width() < 800) {
            $("#login .col-xl-6.p-xl-5")
                .removeClass("box");
        } else {
            $("#login .col-xl-6.p-xl-5")
                .addClass("box");
        }
        $(window)
            .resize(() => {
                if ($(window)
                    .width() < 800) {
                    $("#login .col-xl-6.p-xl-5")
                        .removeClass("box");
                } else {
                    $("#login .col-xl-6.p-xl-5")
                        .addClass("box");
                }
            })
    })
    
$("#user-email")
    .focus(() => {
        $("#email-err")
            .addClass("d-none");
    });
$("#user-password")
    .focus(() => {
        $("#pass-err")
            .addClass("d-none");
    });

auth.onAuthStateChanged(function (user) {
    if (user) {
        const verified = user.emailVerified;
        if (verified) {
            const data = db.collection("User")
                .doc(user.email);
            data.get()
                .then((snap) => {
                    if (snap.data()["status"] === "anak") {
                        alert("Maaf tidak tidak tersedia layanan versi web untuk peran Anak");
                        auth.signOut()
                            .then(() => {
                                return window.location.assign("/login");
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    } else
                        return window.location.assign("/parent");
                });
        } else {
            return window.location.assign('/verificationEmail');
        }

    }
});