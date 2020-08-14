import "./bottom-box.js"

class DetailApp extends HTMLElement {
    set detailAplikasi(data) {
        this._data = data;
        this.renderTabel();
    }
    connectedCallback() {
        this.id = this.getAttribute('id') || null;
        this.render();
    }
    render() {
        const data = { id: this.id, title: "Penggunaan Aplikasi" };
        const box = document.createElement("bottom-box");
        box.value = data;
        $(this)
            .append(box);
        const detail = document.createElement("div");
        $(detail)
            .append(`<div class="d-flex w-100 pt-4">
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
                        <table class="w-100 tabel-detail">
                        <tr>
                            <th>Aplikasi</th>
                            <th>Durasi</th>
                            <th>Internet</th>
                        </tr>
                </div></div>`);
        $(`#${data.id}-content`)
            .append(detail);
    }
    getSortedByInternet() {
        const sortInternet = this._data.dataset.sort(function (a, b) {
            return b.internet - a.internet;
        })
        sortInternet.forEach(element => {
            const jam = element.durasi / 3600 / 1000
            const menit = Math.round(jam * 60 % 60);
            const cetakDurasi = Math.floor(jam) == 0 ? menit + ' Menit' : Math.floor(jam) + " Jam " + menit + " Menit";
            $(".tabel-detail tbody")
                .append(`<tr>
                        <td><img src="${element.icon}" class="justify-content-end icon-small mr-1">${element.namaApp.substring(0,15)}</td>
                        <td>${cetakDurasi}</td>
                        <td>${(element.internet/(1000*1000)).toFixed(2)} MB</td>
                    </tr>`);
        });
    }
    getSortedByDuration() {
        const sortDurasi = this._data.dataset.sort(function (a, b) {
            return b.durasi - a.durasi;
        })
        sortDurasi.forEach(element => {
            const jam = element.durasi / 3600 / 1000
            const menit = Math.round(jam * 60 % 60);
            const cetakDurasi = Math.floor(jam) == 0 ? menit + ' Menit' : Math.floor(jam) + " Jam " + menit + " Menit";
            $(".tabel-detail tbody")
                .append(`<tr>
                        <td><img src="${element.icon}" class="justify-content-end icon-small mr-1">${element.namaApp.substring(0,15)}</td>
                        <td>${cetakDurasi}</td>
                        <td>${(element.internet/(1000*1000)).toFixed(2)} MB</td>
                    </tr>`);
        });
    }
    getSortedByName() {
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
        })
        sortNama.forEach(element => {
            const jam = element.durasi / 3600 / 1000
            const menit = Math.round(jam * 60 % 60);
            const cetakDurasi = Math.floor(jam) == 0 ? menit + ' Menit' : Math.floor(jam) + " Jam " + menit + " Menit";
            $(".tabel-detail tbody")
                .append(`<tr>
                        <td><img src="${element.icon}" class="justify-content-end icon-small mr-1">${element.namaApp.substring(0,15)}</td>
                        <td>${cetakDurasi}</td>
                        <td>${(element.internet/(1000*1000)).toFixed(2)} MB</td>
                    </tr>`);
        });
    }
    renderTabel() {
        $(".tabel-detail tbody")
            .ready(() => {
                if (this._data.msg == "berisi") {
                    this.getSortedByName();
                    $("#sortDetail")
                        .change(() => {
                            let value = "";
                            $("#sortDetail option:selected")
                                .each(function () {
                                    value += $(this)
                                        .val();
                                })
                            console.log(value);
                            $(".tabel-detail tbody")
                                .html(`<tr>
                                    <th width="10rem">Aplikasi</th>
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