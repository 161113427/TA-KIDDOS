import "./bottom-box.js"

class SettingsApp extends HTMLElement {
    set listAplikasi(data) {
        this._data = data;
        this.renderTabel();
    }
    connectedCallback() {
        this.id = this.getAttribute('id') || null;
        this.render();
    }
    render() {
        const data = { id: this.id, title: "Pengaturan Aplikasi" };
        const box = document.createElement("bottom-box");
        box.value = data;
        $(this)
            .append(box);
        const detail = document.createElement("div");
        $(detail)
            .append(`<style>
        input[type="number"]{
            border:1px solid #c3c3c3;
            border-radius:8px;
        }
        .durasi{
            width:5rem;
            text-align:center;
        }
        .btn-dark{
            font-family:'Roboto',sans-serif !important;
            font-size:0.85rem !important;
            background:#363bac;
        }
        .btn-dark:hover{
            transition:0.2s;
            background:#3548c2;
        }
        @media(min-width:1024px){
            .list-settings li{
                box-shadow: 2px 2px 10px rgba(0,0,0,0.2);
                border-radius: 18px;
                align-items: center;
                vertical-align: middle;
                padding-left: 2rem;
                padding-bottom: 2rem;
            }
        }
        @media(max-width:700px){
            h4{
                font-size:0.85rem;
            }
            .tabel-detail td:nth-child(2){
                text-align:center !important;
            }
            .btn-dark{
                width:100%;
                margin-top:1.2rem;
                margin-right:0 !important;
            }
            td .durasi{
                width:3rem;
            }
        }
        @media(max-height:680){
            .tabel-detail td:nth-child(2){
                text-align:center !important;
            }
            .btn-dark{
                width:100%;
                margin-top:1.2rem;
                margin-right:0 !important;
            }
        }
        </style>
        <div class="d-block w-100 pt-4 list-settings"></div>`);
        $(`#${data.id}-content`)
            .append(detail);

        this.pengaturanPembatasanAplikasi();
        this.pengaturanRekamLayar();
        this.pengaturanBlokirAplikasi();
        $(`#${data.id}-content`)
            .ready(() => {
                $('#blokirAplikasi')
                    .click(() => {
                        $("#blokirList")
                            .toggle('slow');
                        $("#batasiList")
                            .hide('slow');
                        $("#rekamList")
                            .hide('slow');
                    })
                $('#batasiAplikasi')
                    .click(() => {
                        $("#batasiList")
                            .toggle('slow');
                        $("#blokirList")
                            .hide('slow');
                        $("#rekamList")
                            .hide('slow');
                    })
                $('#rekamAplikasi')
                    .click(() => {
                        $("#rekamList")
                            .toggle('slow');
                        $("#batasiList")
                            .hide('slow');
                        $("#blokirList")
                            .hide('slow');
                    })
            })
    }
    pengaturanPembatasanAplikasi() {
        $('.list-settings')
            .append(`
                <ul class="w-100 px-0">
                    <li>
                        <a id="batasiAplikasi" class="p-3"><h4 class="text-left"><ion-icon name="caret-forward" class="pr-3"></ion-icon>Pembatasan Aplikasi</h4></a>
                        <div class="w-100 tabel-detail1 pr-3" id="batasiList" style="display:none">
                            
                            <table class="w-100 tabel-detail">
                                <tr>
                                    <th>Aplikasi</th>
                                    <th>Durasi</th>
                                    <th>Aktif</th>
                                </tr>
                            </table>
                        </div>
                    </li>
                </ul>`);
    }
    pengaturanBlokirAplikasi() {
        $('.list-settings')
            .append(`
                <ul class="w-100 px-0">
                    <li>
                        <a id="blokirAplikasi" class="p-3"><h4 class="text-left"><ion-icon name="caret-forward" class="pr-3"></ion-icon>Blokir Aplikasi</h4></a>
                        <div class="justify-content-center w-100 tabel-detail1 pr-3" id="blokirList" style="display:none">
                            <table class="w-100 tabel-detail">
                                <tr>
                                    <th>Aplikasi</th>
                                    <th>Aktif</th>
                                </tr>
                            </table>
                        </div>
                    </li>
                </ul>`);
    }
    pengaturanRekamLayar() {
        $('.list-settings')
            .append(`
                <ul class="w-100 px-0">
                    <li>
                        <a id="rekamAplikasi" class="p-3"><h4 class="text-left"><ion-icon name="caret-forward" class="pr-3"></ion-icon>Perekaman Layar</h4></a>
                        <div class="w-100 tabel-detail1 pr-3" id="rekamList" style="display:none">
                            <div class="d-flex flex-wrap justify-content-end align-items-center mr-md-5 mb-3">
                                <p class="mr-3"><strong>Durasi Perekaman</strong></p>
                                <div class="mr-2"><select id="durasiPerekaman">
                                    <option value="1">1 Menit</option>
                                    <option value="2">2 Menit</option>
                                    <option value="3">3 Menit</option>
                                    <option value="4">4 Menit</option>
                                    <option value="5">5 Menit</option>
                                </select></div>
                            </div>
                            <table class="w-100 tabel-detail">
                                <tr>
                                    <th>Aplikasi</th>
                                    <th>Aktif</th>
                                </tr>
                            </table>
                        </div>
                    </li>
                </ul>`);
    }
    setDurasiPembatasan(user, anak, index, namaApp, namaPaketAplikasi) {
        if ($(`#batasi${index}-${namaApp.split(/\W/).join('')}`)
            .is(':checked')) {
            let value = 0;
            $(`#durasiPembatasan${index}-${namaApp.split(/\W/).join('')} option:selected`)
                .each(function () {
                    value += $(this)
                        .val();
                });
            user.doc(anak)
                .collection('Pengaturan')
                .doc("Pembatasan")
                .update({
                    waktuDimutakhirkan: Date.now()
                });
            user.doc(anak)
                .collection('Pengaturan')
                .doc("Pembatasan")
                .collection('Aktif')
                .doc(namaApp)
                .set({
                    namaAplikasi: namaApp,
                    namaPaketAplikasi: namaPaketAplikasi,
                    durasiPembatasan: parseInt(value)
                })
                .then(() => {
                    alert('Pengaturan berhasil disimpan');
                })
        }
    }
    static updateBlokir(user, anak, element, namaApp, namaPaketAplikasi, index) {

        user.doc(anak)
            .collection('Pengaturan')
            .doc(element)
            .set({ waktuDimutakhirkan: Date.now() })
            .then(() => {
                user.doc(anak)
                    .collection('Pengaturan')
                    .doc(element)
                    .collection('Aktif')
                    .doc(namaApp)
                    .set({
                        namaAplikasi: namaApp,
                        namaPaketAplikasi: namaPaketAplikasi
                    })
                    .then(() => {
                        user.doc(anak)
                            .collection('Pengaturan')
                            .doc('Pembatasan')
                            .collection('Aktif')
                            .doc(namaApp)
                            .delete();
                        user.doc(anak)
                            .collection('Pengaturan')
                            .doc('Perekaman')
                            .collection('Aktif')
                            .doc(namaApp)
                            .delete();
                        user.doc(anak)
                            .collection('Pengaturan')
                            .doc('Pembatasan')
                            .update({ waktuDimutakhirkan: Date.now() })
                    })
                    .then(() => {
                        $(`#batasi${index}-${namaApp.split(/\W/).join('')}`)
                            .prop('checked', false);
                        $(`#rekam${index}-${namaApp.split(/\W/).join('')}`)
                            .prop('checked', false);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
    }
    static updatePembatasan(user, anak, element, namaApp, namaPaketAplikasi, index) {
        let val = 0;
        $(`#durasiPembatasan${index}-${namaApp.split(/\W/).join('')} option:selected`)
            .each(function () {
                val += $(this)
                    .val();
            });
        user.doc(anak)
            .collection('Pengaturan')
            .doc(element)
            .set({ waktuDimutakhirkan: Date.now() })
            .then(() => {
                user.doc(anak)
                    .collection('Pengaturan')
                    .doc(element)
                    .collection('Aktif')
                    .doc(namaApp)
                    .set({
                        namaAplikasi: namaApp,
                        namaPaketAplikasi: namaPaketAplikasi,
                        durasiPembatasan: parseInt(val)
                    })
                    .then(() => {
                        user.doc(anak)
                            .collection('Pengaturan')
                            .doc('Blokir')
                            .collection('Aktif')
                            .doc(namaApp)
                            .delete();
                        user.doc(anak)
                            .collection('Pengaturan')
                            .doc('Blokir')
                            .update({ waktuDimutakhirkan: Date.now() })
                    })
                    .then(() => {
                        $(`#blokir${index}-${namaApp.split(/\W/).join('')}`)
                            .prop('checked', false);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
    }
    static updatePerekaman(user, anak, element, namaApp, namaPaketAplikasi, index) {
        user.doc(anak)
            .collection('Pengaturan')
            .doc(element)
            .collection('Aktif')
            .doc(namaApp)
            .set({
                namaAplikasi: namaApp,
                namaPaketAplikasi: namaPaketAplikasi
            })
        user.doc(anak)
            .collection('Pengaturan')
            .doc('Blokir')
            .collection('Aktif')
            .doc(namaApp)
            .delete()
            .then(() => {
                $(`#blokir${index}-${namaApp.split(/\W/).join('')}`)
                    .prop('checked', false);
            });
    }
    updateDurasiPerekaman(doc, index) {
        let value = 0;
        $("#durasiPerekaman option:selected")
            .each(function () {
                value += $(this)
                    .val();
            });
        doc.update({
            durasiPerekaman: parseInt(value),
            waktuDimutakhirkan: Date.now()
        })
        if (index == 0) {
            alert('Pengaturan berhasil disimpan');
        }
    }
    toggleStatus(namaApp, index, namaPaketAplikasi) {
        const user = this._data.user;
        const anak = this._data.anak;
        let Pembatasan = [];
        let listPengaturan = ['Blokir', 'Pembatasan', 'Perekaman'];
        let listInput = ['blokir', 'batasi', 'rekam'];
        const doc = user.doc(anak)
            .collection('Pengaturan')
            .doc("Perekaman");
        $("#durasiPerekaman")
            .change(() => {
                this.updateDurasiPerekaman(doc, index);
            });
        $(`#durasiPembatasan${index}-${namaApp.split(/\W/).join('')}`)
            .change(() => {
                this.setDurasiPembatasan(user, anak, index, namaApp, namaPaketAplikasi);
            })
        listPengaturan.forEach((element, i) => {
            user.doc(anak)
                .collection('Pengaturan')
                .doc(element)
                .collection('Aktif')
                .get()
                .then(snap => {
                    snap.forEach(data => {
                        $(`#${listInput[i]}${index}${data.data()['namaAplikasi'].split(/\W/).join('')}`)
                            .ready(() => {
                                $(`#${listInput[i]}${index}-${data.data()['namaAplikasi'].split(/\W/).join('')}`)
                                    .attr('checked', 'check');
                            })
                    })
                });
            $(`#${listInput[i]}${index}-${namaApp.split(/\W/).join('')}`)
                .change(function () {
                    if (this.checked) {
                        if (element == "Blokir") {
                            if ($(`#batasi${index}-${namaApp.split(/\W/).join('')}`)
                                .is(':checked') == true || $(`#rekam${index}-${namaApp.split(/\W/).join('')}`)
                                .is(':checked') == true) {
                                const confirm = window.confirm(`Apakah anda ingin mengaktifkan Blokir dan menonaktifkan Pembatasan dan Perekaman pada Aplikasi ${namaApp}?`);
                                if (confirm) {
                                    SettingsApp.updateBlokir(user, anak, element, namaApp, namaPaketAplikasi, index);
                                    alert('Pengaturan berhasil disimpan');
                                } else $(`#blokir${index}-${namaApp.split(/\W/).join('')}`)
                                    .prop('checked', false);
                            } else {
                                SettingsApp.updateBlokir(user, anak, element, namaApp, namaPaketAplikasi, index);
                                alert('Pengaturan berhasil disimpan');
                            }
                        } else if (element == "Pembatasan") {
                            if ($(`#blokir${index}-${namaApp.split(/\W/).join('')}`)
                                .is(':checked') == true) {
                                const confirm = window.confirm(`Aplikasi ${namaApp} telah diblokir sebelumnya. Apakah anda ingin mengaktifkan Pembatasan dan menonaktifkan Blokir pada Aplikasi ${namaApp}?`);
                                if (confirm) {
                                    SettingsApp.updatePembatasan(user, anak, element, namaApp, namaPaketAplikasi, index);
                                    alert('Pengaturan berhasil disimpan');
                                } else {
                                    $(`#batasi${index}-${namaApp.split(/\W/).join('')}`)
                                        .prop('checked', false);
                                }
                            } else {
                                SettingsApp.updatePembatasan(user, anak, element, namaApp, namaPaketAplikasi, index)
                                alert('Pengaturan berhasil disimpan');
                            }
                        } else {
                            if ($(`#blokir${index}-${namaApp.split(/\W/).join('')}`)
                                .is(':checked') == true) {
                                const confirm = window.confirm(`Aplikasi ${namaApp} telah diblokir sebelumnya. Apakah anda ingin mengaktifkan Perekaman dan menonaktifkan Blokir pada Aplikasi ${namaApp}?`);
                                if (confirm) {
                                    SettingsApp.updatePerekaman(user, anak, element, namaApp, namaPaketAplikasi, index);
                                    alert('Pengaturan berhasil disimpan');
                                } else {
                                    $(`#rekam${index}-${namaApp.split(/\W/).join('')}`)
                                        .prop('checked', false);
                                }
                            } else {
                                SettingsApp.updatePerekaman(user, anak, element, namaApp, namaPaketAplikasi, index);
                                alert('Pengaturan berhasil disimpan');
                            }
                        }
                    } else {
                        user.doc(anak)
                            .collection('Pengaturan')
                            .doc(element)
                            .update({
                                waktuDimutakhirkan: Date.now()
                            });
                        user.doc(anak)
                            .collection('Pengaturan')
                            .doc(element)
                            .collection('Aktif')
                            .doc(namaApp)
                            .delete();
                        alert('Pengaturan berhasil disimpan');
                    }
                })
        });
    }
    renderTabel() {
        $(".tabel-detail tbody")
            .ready(() => {
                if (this._data.msg == "berisi") {
                    const sortNama = this._data.dataset.sort(function (a, b) {
                        const namaA = a.namaApp.toUpperCase();
                        const namaB = b.namaApp.toUpperCase();
                        if (namaA < namaB) {
                            return -1;
                        }
                        if (namaA > namaB) {
                            return 1;
                        }
                        return 0;
                    });
                    this._data.user.doc(this._data.anak)
                        .collection('Pengaturan')
                        .doc('Perekaman')
                        .get()
                        .then((snap) => {
                            $(`#durasiPerekaman option`)
                                .each(function () {
                                    if ($(this)
                                        .val() == snap.data()['durasiPerekaman'])
                                        $(this)
                                        .attr('selected', true);
                                })
                        });
                    sortNama.forEach((element, idx) => {
                        $("#blokirList .tabel-detail tbody")
                            .append(`<tr>
                                        <td><img src="${element.icon}" class="justify-content-end icon-small mr-1">${element.namaApp.length>12 && $(window).width()<1024?element.namaApp.substring(0,12) + '...':element.namaApp.substring(0,30)}</td>
                                        <td><div class="d-flex justify-content-center">
                                        <input type="checkbox" id="blokir${idx}-${element.namaApp.split(/\W/).join('')}">
                                      </div></td>
                                    </tr>`);
                        this._data.user.doc(this._data.anak)
                            .collection('Pengaturan')
                            .doc('Pembatasan')
                            .collection('Aktif')
                            .get()
                            .then((snap) => {
                                snap.forEach(e => {
                                    $(`#durasiPembatasan${idx}-${element.namaApp.split(/\W/).join('')} option`)
                                        .each(function () {
                                            if ($(this)
                                                .val() == e.data()['durasiPembatasan'] && e.data()['namaAplikasi'] == element.namaApp)
                                                $(this)
                                                .attr('selected', true);
                                        })
                                })
                            })
                        $("#batasiList .tabel-detail tbody")
                            .append(`<tr>
                                        <td><img src="${element.icon}" class="justify-content-end icon-small mr-1">${element.namaApp.length>12 && $(window).width()<1024?element.namaApp.substring(0,12) + '...':element.namaApp.substring(0,30)}</td>
                                        <td><div class="mr-2"><select id="durasiPembatasan${idx}-${element.namaApp.split(/\W/).join('')}">
                                        <option value="1">1 Jam</option>
                                        <option value="2">2 Jam</option>
                                        <option value="3">3 Jam</option>
                                        </select></td>
                                        <td><div class="d-flex justify-content-center">
                                        <input type="checkbox" id="batasi${idx}-${element.namaApp.split(/\W/).join('')}">
                                      </div></td>
                                    </tr>`);
                        $("#rekamList .tabel-detail tbody")
                            .append(`<tr>
                                        <td><img src="${element.icon}" class="justify-content-end icon-small mr-1">${element.namaApp.length>12 && $(window).width()<1024?element.namaApp.substring(0,12) + '...':element.namaApp.substring(0,30)}</td>
                                        <td><div class="d-flex justify-content-center">
                                        <input type="checkbox" id="rekam${idx}-${element.namaApp.split(/\W/).join('')}">
                                        </div></td>
                                    </tr>`);
                    })
                    this._data.dataset.forEach((element, idx) => {
                        this.toggleStatus(element.namaApp, idx, element.namaPaket);
                    });
                } else {
                    $(`#${this.id}-content`)
                        .append('<h4 class="py-5">Belum ada informasi untuk ditampilkan</h4>');
                    $('div.list-settings')
                        .remove();
                }
            });
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (!newValue)
            this[name] = newValue;
        this.render();
    }

    static getobservedAttributes() {
        return ["id"];
    }
}



customElements.define("settings-app", SettingsApp);