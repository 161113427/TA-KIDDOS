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
                        <div class="w-100 tabel-detail1" id="batasiList" style="display:none">
                            
                            <table class="w-100 tabel-detail">
                                <tr>
                                    <th>Aplikasi</th>
                                    <th>Durasi</th>
                                    <th>Aktif/Non-aktif</th>
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
                        <div class="justify-content-center w-100 tabel-detail1" id="blokirList" style="display:none">
                            <table class="w-100 tabel-detail">
                                <tr>
                                    <th>Aplikasi</th>
                                    <th>Aktif/Non-aktif</th>
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
                        <div class="w-100" id="rekamList" style="display:none">
                            <div class="d-flex flex-wrap justify-content-end align-items-center mr-md-5 mb-3 tabel-detail1">
                                <p class="mr-3"><strong>Durasi Perekaman</strong></p>
                                <div class="mr-2"><select id="durasiPerekaman">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select></div>
                                <p class="mr-3"> Menit</p>
                            </div>
                            <table class="w-100 tabel-detail">
                                <tr>
                                    <th>Aplikasi</th>
                                    <th>Aktif/Non-aktif</th>
                                </tr>
                            </table>
                        </div>
                    </li>
                </ul>`);
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
            });
        $(`#durasiPembatasan${index}-${namaApp.split(' ').join('')}`)
            .change(() => {
                if ($(`#batasi${index}-${namaApp.split(' ').join('')}`)
                    .is(':checked')) {
                    let value = 0;
                    $(`#durasiPembatasan${index}-${namaApp.split(' ').join('')} option:selected`)
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
            })
        listPengaturan.forEach((element, i) => {
            user.doc(anak)
                .collection('Pengaturan')
                .doc(element)
                .collection('Aktif')
                .get()
                .then(snap => {
                    snap.forEach(data => {
                        $(`#${listInput[i]}${index}${data.data()['namaAplikasi'].split(' ').join('')}`)
                            .ready(() => {
                                $(`#${listInput[i]}${index}-${data.data()['namaAplikasi'].split(' ').join('')}`)
                                    .attr('checked', 'check');
                            })
                    })
                });
            $(`#${listInput[i]}${index}-${namaApp.split(' ').join('')}`)
                .change(function () {
                    alert('Pengaturan berhasil disimpan');
                    if (this.checked) {
                        user.doc(anak)
                            .collection('Pengaturan')
                            .doc(element)
                            .update({
                                waktuDimutakhirkan: Date.now()
                            });
                        if (element == "Blokir") {
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
                                    $(`#batasi${index}-${namaApp.split(' ').join('')}`)
                                        .removeAttr('checked');
                                    user.doc(anak)
                                        .collection('Pengaturan')
                                        .doc('Pembatasan')
                                        .collection('Aktif')
                                        .doc(namaApp)
                                        .delete();
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                        } else if (element == "Pembatasan") {
                            let val = 0;
                            $(`#durasiPembatasan${index}-${namaApp.split(' ').join('')} option:selected`)
                                .each(function () {
                                    val += $(this)
                                        .val();
                                });
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
                        } else {
                            user.doc(anak)
                                .collection('Pengaturan')
                                .doc(element)
                                .collection('Aktif')
                                .doc(namaApp)
                                .set({
                                    namaAplikasi: namaApp,
                                    namaPaketAplikasi: namaPaketAplikasi
                                })
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
                                        <td><img src="${element.icon}" class="justify-content-end icon-small mr-1">${element.namaApp.substring(0,15)}</td>
                                        <td><div class="d-flex justify-content-center">
                                        <input type="checkbox" id="blokir${idx}-${element.namaApp.split(' ').join('')}">
                                      </div></td>
                                    </tr>`);
                        this._data.user.doc(this._data.anak)
                            .collection('Pengaturan')
                            .doc('Pembatasan')
                            .collection('Aktif')
                            .get()
                            .then((snap) => {
                                snap.forEach(e => {
                                    $(`#durasiPembatasan${idx}-${element.namaApp.split(' ').join('')} option`)
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
                                        <td><img src="${element.icon}" class="justify-content-end icon-small mr-1">${element.namaApp.substring(0,15)}</td>
                                        <td><div class="mr-2"><select id="durasiPembatasan${idx}-${element.namaApp.split(' ').join('')}">
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        </select>
                                        <p class="mr-3"> Jam</p></td>
                                        <td><div class="d-flex justify-content-center">
                                        <input type="checkbox" id="batasi${idx}-${element.namaApp.split(' ').join('')}">
                                      </div></td>
                                    </tr>`);
                        $("#rekamList .tabel-detail tbody")
                            .append(`<tr>
                                        <td><img src="${element.icon}" class="justify-content-end icon-small mr-1">${element.namaApp.substring(0,15)}</td>
                                        <td><div class="d-flex justify-content-center">
                                        <input type="checkbox" id="rekam${idx}-${element.namaApp.split(' ').join('')}">
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