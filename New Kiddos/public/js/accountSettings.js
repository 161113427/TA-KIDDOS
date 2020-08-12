import { auth, db } from "./auth.js";
import "../css/style.css";

auth.onAuthStateChanged(user => {
    if (!user) {
        return window.location.assign('/login');
    } else {
        if (user.emailVerified) {
            if (user.photoURL != null) {
                $('.image-profile')
                    .attr('src', user.photoURL)
            } else {
                $('.image-profile')
                    .attr('src', '../image/social.svg');
            }
            $(".nama")
                .text(user.displayName);
            $("#dropdownMenuProfile")
                .attr('src', user.photoURL);
            $('input[name="nama-user"]')
                .val(user.displayName)
            $('#changePhoto')
                .click(() => {
                    $('input[type="file"]')
                        .trigger('click');
                    $('input[type="file"]')
                        .change((e) => {
                            const file = document.getElementById('choosePhoto')
                                .files[0];
                            const storage = firebase.storage()
                                .ref()
                                .child(`${user.email}/profilePhoto/profilePhoto.${file.name.split('.').pop()}`);
                            storage.delete();
                            storage.put(file, { contentType: file.type })
                                .then((imgURL) => {
                                    return imgURL.ref.getDownloadURL()
                                })
                                .then(url => {
                                    user.updateProfile({
                                        photoURL: url
                                    })
                                })
                                .then(() => {
                                    alert("Gambar berhasil diubah");
                                    return window.location.assign('/accountSettings');
                                })
                            e.preventDefault();
                        });
                });
            $("#updateName")
                .submit((e) => {
                    user.updateProfile({
                            displayName: $('input[name="nama-user"]')
                                .val()
                        })
                        .then(() => {
                            console.log(user.email);
                            return db.collection('User')
                                .doc(user.email)
                                .update({
                                    nama: user.displayName
                                })
                                .catch(err => { alert(err) });
                        })
                        .then(() => {
                            alert('Nama berhasil diganti');
                            return window.location.assign('/accountSettings');
                        })
                        .catch(function (error) {
                            alert(error.message);
                        });
                    e.preventDefault();
                });
            $("#updateSecurity")
                .submit((e) => {
                    if ($('input[name="new-password"]')
                        .val() === $('input[name="re-new-password"]')
                        .val()) {
                        user.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(user.email, $('input[name="password"]')
                                .val()))
                            .then(result => {
                                user.updatePassword($('input[name="new-password"]')
                                        .val())
                                    .then(() => {
                                        alert('Kata sandi berhasil diganti');
                                        return window.location.assign('/accountSettings');
                                    })
                            })
                            .catch(err => {
                                alert("Kata sandi lama tidak sesuai");
                            })
                    } else {
                        alert("konfirmasi kata sandi tidak sesuai");
                    }
                    e.preventDefault();
                });

            $('input[name="btn-cancel-change-name"]')
                .click(() => {
                    $('input[name="nama-user"]')
                        .attr('disabled', true);
                    $('input[name="nama-user"]')
                        .val(user.displayName);
                    $('input[name="btn-save-change-name"]')
                        .attr('disabled', true);
                    $('input[name="btn-cancel-change-name"]')
                        .attr('disabled', true);
                })
            $('input[name="btn-cancel-change-password"]')
                .click(() => {
                    $('input[name="password"]')
                        .attr('disabled', true);
                    $('input[name="new-password"]')
                        .attr('disabled', true);
                    $('input[name="re-new-password"]')
                        .attr('disabled', true);
                    $('input[name="password"]')
                        .val('************');
                    $('input[name="new-password"]')
                        .val('');
                    $('input[name="re-new-password"]')
                        .val('');
                    $('input[name="btn-save-change-password"]')
                        .attr('disabled', true);
                    $('input[name="btn-cancel-change-password"]')
                        .attr('disabled', true);
                })
        }
    }
})

$("#editNama")
    .click(() => {
        $('input[name="nama-user"]')
            .removeAttr('disabled');
        $('input[name="btn-cancel-change-name"]')
            .removeAttr('disabled');
        $('input[name="nama-user"]')
            .keyup((e) => {
                $('input[name="btn-cancel-change-name"]')
                    .removeAttr('disabled');
                if ($('input[name="btn-save-change-name"]')
                    .val() == "") {
                    $('input[name="btn-save-change-name"]')
                        .attr('disabled', 'true');
                } else {
                    $('input[name="btn-save-change-name"]')
                        .removeAttr('disabled');
                }
                e.preventDefault();
            });
    });
$("#editPassword")
    .click(() => {
        $('input[name="password"]')
            .removeAttr('disabled');
        $('input[name="new-password"]')
            .removeAttr('disabled');
        $('input[name="re-new-password"]')
            .removeAttr('disabled');
        $('input[name="password"]')
            .val("");
        $('input[name="new-password"]')
            .val("");
        $('input[name="re-new-password"]')
            .val("");
        $('input[name="btn-cancel-change-password"]')
            .removeAttr('disabled');
        $('input[name="password"]')
            .keyup((e) => {
                if ($('input[name="btn-save-change-password"]')
                    .val() == "") {
                    $('input[name="btn-save-change-password"]')
                        .attr('disabled', 'true');
                } else {
                    $('input[name="btn-save-change-password"]')
                        .removeAttr('disabled');
                }
                e.preventDefault();
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