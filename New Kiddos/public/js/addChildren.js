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
                                .toString();
                            const emailAnak = $('#email-anak')
                                .val();
                            $('#kirimVerifikasi')
                                .html(`<div class="spinner-border position-absolute" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>`)
                            fetch('/addChildren', {
                                    method: "POST",
                                    headers: {
                                        Accept: "application/json",
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        kodeVerifikasi: verifCode,
                                        emailAnak: emailAnak
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
                                    $('#kirimVerifikasi')
                                        .html(`
                                <div class="py-lg-4 px-lg-5 verif-box text-center">
                                    <p>Masukkan alamat email anak yang ingin dipantau</p>
                                    <div class="form-group">
                                        <input type="email" class="form-control" id="email-anak" required="" value=""></input>
                                        <label for="email-anak" class="col-form-label text-dark">Email</label>
                                    </div>
                                    <div class="d-flex justify-content-between mt-3">
                                        <input type="submit" value="Kirim" class="btn button btn-primary mt-3 px-5">
                                        <a href="/parent"><input type="button" value="Batal" class="btn button btn-link mt-3 text-decoration-none"></a>
                                    </div>
                                </div>`)
                                })
                            e.preventDefault();
                        })
                } else { alert('Email Anda belum terverifikasi, silakan verifikasi akun terlebih dahulu'); return window.location.assign('/verificationEmail'); }
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