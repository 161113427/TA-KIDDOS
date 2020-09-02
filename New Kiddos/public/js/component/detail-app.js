import "./bottom-box.js"

class DetailApp extends HTMLElement {
    set detailAplikasi(data) {
        this._dataDetail = data;
        this.renderTabelDetail();
        this.createDetailApp();
    }
    set uninstalledAplikasi(data) {
        this._dataUninstall = data;
        this.renderTabelUninstall();
        this.createUninstalledApp();
    }
    connectedCallback() {
        this.id = this.getAttribute('id') || null;
        this.render();
    }
    render() {
        const data = { id: this.id, title: "Informasi Aplikasi" };
        const box = document.createElement("bottom-box");
        box.value = data;
        $(this)
            .append(box);
        const menu = document.createElement("div");
        $(menu)
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
            .append(menu);
    }
    createUninstalledApp() {
        $('.list-settings')
            .append(`
                <ul class="w-100 px-0">
                    <li>
                        <a id="apkTerhapus" class="p-3"><h4 class="text-left"><ion-icon name="caret-forward" class="pr-3"></ion-icon>Aplikasi Terhapus</h4></a>
                        <div id="apkTerhapusList">
                            <div class="d-flex w-100 pt-4">
                                <div class="justify-content-center d-flex w-100 tabel-detail1">
                                    <table class="w-100 tabel-detail uninstalled-app">
                                    <tr>
                                        <th>Aplikasi</th>
                                        <th>Tanggal Hapus</th>
                                    </tr>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>`);
    }
    createDetailApp() {
        $('.list-settings')
            .append(`
                <ul class="w-100 px-0">
                    <li>
                        <a id="penggunaanApk" class="p-3"><h4 class="text-left"><ion-icon name="caret-forward" class="pr-3"></ion-icon>Penggunaan Aplikasi</h4></a>
                        <div id="penggunaanApkList">
                            <div class="d-flex w-100 pt-4">
                                <table class="w-100 mb-3">
                                    <tbody>
                                        <tr>
                                            <td><p class="px-lg-5 ml-3 total-aplikasi">Tidak Ada Aplikasi</p></td>
                                            <td></td>
                                            <td class="d-flex justify-content-center">
                                                <p><strong>Urutkan &nbsp;&nbsp;</strong>
                                                    <select id="sortDetail" name="Urutkan">
                                                        <option value="namaAplikasi">Nama</option>
                                                        <option value="durasiPenggunaan">Durasi</option>
                                                        <option value="penggunaanInternet">Internet</option>
                                                    </select>
                                                </p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="justify-content-center d-flex w-100 tabel-detail1">
                                <table class="w-100 tabel-detail list-apk">
                                    <tr>
                                        <th>Aplikasi</th>
                                        <th>Durasi</th>
                                        <th>Internet</th>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </li>
                </ul>`);
    }
    getSortedByInternet() {
        const sortInternet = this._dataDetail.dataset.sort(function (a, b) {
            return b.internet - a.internet;
        })
        sortInternet.forEach(element => {
            const jam = element.durasi / 3600 / 1000
            const menit = Math.round(jam * 60 % 60);
            const cetakDurasi = Math.floor(jam) == 0 ? menit + ' Menit' : Math.floor(jam) + " Jam " + menit + " Menit";
            $(".tabel-detail.list-apk tbody")
                .append(`<tr>
                        <td><img src="${element.icon}" class="justify-content-end icon-small mr-1">${element.namaApp.length>12 && $(window).width()<1024?element.namaApp.substring(0,12) + '...':element.namaApp.substring(0,30)}</td>
                        <td>${cetakDurasi}</td>
                        <td>${(element.internet/(1000*1000)).toFixed(2)} MB</td>
                    </tr>`);
        });
    }
    getSortedByDuration() {
        const sortDurasi = this._dataDetail.dataset.sort(function (a, b) {
            return b.durasi - a.durasi;
        })
        sortDurasi.forEach(element => {
            const jam = element.durasi / 3600 / 1000
            const menit = Math.round(jam * 60 % 60);
            const cetakDurasi = Math.floor(jam) == 0 ? menit + ' Menit' : Math.floor(jam) + " Jam " + menit + " Menit";
            $(".tabel-detail.list-apk tbody")
                .append(`<tr>
                        <td><img src="${element.icon}" class="justify-content-end icon-small mr-1">${element.namaApp.length>12 && $(window).width()<1024?element.namaApp.substring(0,12) + '...':element.namaApp.substring(0,30)}</td>
                        <td>${cetakDurasi}</td>
                        <td>${(element.internet/(1000*1000)).toFixed(2)} MB</td>
                    </tr>`);
        });
    }
    getSortedByName() {
        const sortNama = this._dataDetail.dataset.sort(function (a, b) {
            const namaA = a.namaApp.toUpperCase();
            const namaB = b.namaApp.toUpperCase();
            if (namaA < namaB) {
                return -1;
            }
            if (namaA > namaB) {
                return 1;
            }
            return 0;
        })
        sortNama.forEach(element => {
            const jam = element.durasi / 3600 / 1000
            const menit = Math.round(jam * 60 % 60);
            const cetakDurasi = Math.floor(jam) == 0 ? menit + ' Menit' : Math.floor(jam) + " Jam " + menit + " Menit";
            $(".tabel-detail.list-apk tbody")
                .append(`<tr>
                        <td><img src="${element.icon}" class="justify-content-end icon-small mr-1">${element.namaApp.length>12 && $(window).width()<1024?element.namaApp.substring(0,12) + '...':element.namaApp.substring(0,30)}</td>
                        <td>${cetakDurasi}</td>
                        <td>${(element.internet/(1000*1000)).toFixed(2)} MB</td>
                    </tr>`);
        });
    }
    getUninstalledApp() {
        this._dataUninstall.forEach(element => {
            const tglHapus = new Date(element.waktuHapus)
                .getDate();
            const bulanHapus = new Date(element.waktuHapus)
                .getMonth();
            const tahunHapus = new Date(element.waktuHapus)
                .getFullYear();
            $(".tabel-detail.uninstalled-app tbody")
                .append(`<tr>
                            <td>${element.namaApp.length>12 && $(window).width()<1024?element.namaApp.substring(0,12) + '...':element.namaApp.substring(0,30)}</td>
                            <td>Dihapus pada ${tglHapus}/${bulanHapus+1}/${tahunHapus}</td>
                        </tr>`);
        })
    }
    renderTabelDetail() {
        $(".tabel-detail.list-apk tbody")
            .ready(() => {
                $("#penggunaanApkList")
                    .hide('');
                $(`#penggunaanApk`)
                    .click(() => {
                        $("#penggunaanApkList")
                            .toggle('slow');
                        $("#apkTerhapusList")
                            .hide('slow');
                    })
                if (this._dataDetail.msg == "berisi") {
                    this.getSortedByName();
                    $('.total-aplikasi')
                        .text(`${this._dataDetail.dataset.length} Aplikasi`)
                    $("#sortDetail")
                        .change(() => {
                            let value = "";
                            $("#sortDetail option:selected")
                                .each(function () {
                                    value += $(this)
                                        .val();
                                });
                            $(".tabel-detail.list-apk tbody")
                                .html(`<tr>
                                    <th>Aplikasi</th>
                                    <th>Durasi</th>
                                    <th>Internet</th>
                                </tr>`);
                            if (value == "durasiPenggunaan") {
                                this.getSortedByDuration();
                            } else if (value == "penggunaanInternet") {
                                this.getSortedByInternet();
                            } else if (value == "namaAplikasi") {
                                this.getSortedByName();
                            }
                        })
                } else {
                    $(`#${this.id}-content`)
                        .append('<h4 class="py-5">Belum ada informasi untuk ditampilkan</h4>');
                }
            });
    }
    renderTabelUninstall() {
        $(".tabel-detail.uninstalled-app tbody")
            .ready(() => {
                $("#apkTerhapusList")
                    .hide();
                $(`#apkTerhapus`)
                    .click(() => {
                        $("#apkTerhapusList")
                            .toggle('slow');
                        $("#penggunaanApkList")
                            .hide('slow');
                    })
                this.getUninstalledApp();
            })
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



customElements.define("detail-app", DetailApp);