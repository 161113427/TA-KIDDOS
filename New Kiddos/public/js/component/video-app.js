import './bottom-box.js'
class VideoApp extends HTMLElement {
    set dataVideo(data) {
        this._data = data;
        this.render();
    }
    connectedCallback() {
        this.id = this.getAttribute('id') || null;
    }
    createVideoDate(tanggalVideo, hari, Bulan, listApp, idx) {
        $('.list-video')
            .append(`<li class="videoDate container" id="videoHari${idx}">
                <div class="text-left">
                    <h4><strong>${hari[tanggalVideo.getDay()]}, ${tanggalVideo.getDate()} ${Bulan[tanggalVideo.getMonth()]} ${tanggalVideo.getFullYear()}</strong></h4>
                    <p>${listApp.prefixes.length} Video</p>
                </div>
                <ul class="d-flex mt-3">
                    
                </ul>
            </li>`);
    }
    createVideoList(listApp, idx) {
        let namaVideo = [];
        listApp.prefixes.forEach(vidName => {
            const [namaVid, tanggal, jam] = vidName.name.split('_');
            $(`#videoHari${idx} ul`)
                .append(`<li>
                        <div class="box px-lg-3 text-left rounded"><video id="${vidName.name.split(/\W/).join('')}" src="#" height="180" width="300px" controls></video><p class="mt-3 d-flex justify-content-between"><strong>${namaVid[0].toUpperCase()+namaVid.substring(1)}</strong><span>Direkam pada <strong>${jam}</strong></span></p></div></li>`);
            namaVideo.push({ nama: vidName.name, path: vidName.fullPath });
            this.videoViewAdjust();
        });
        namaVideo.forEach(element => {
            const nama = element.nama.split(/\W/)
                .join('');
            $(`#${nama}`)
                .ready(() => {
                    this.generateVideoURL(element, nama);
                    $(`#${nama}`)
                        .click((e) => {
                            this.getVideo(element, nama, e);
                        })
                })
        })
    }
    generateVideoURL(element, nama) {
        firebase.firestore()
            .collection('Video Processing')
            .doc('processedVideo')
            .onSnapshot(snap => {
                const processedURL = snap.data()[`${this._data.uid}_${this._data.anak.split('.').join('')}_${element.nama.split(':').join('')}`];
                if (processedURL)
                    return $(`#${nama}`)
                        .attr('src', processedURL);
            });
    }
    requestVideoURL(element, data) {
        fetch(`/parent/video/${this._data.uid}_${this._data.anak.split('.').join('')}_${element.nama.split(':').join('')}`, { method: "POST", headers: { Accept: 'application/json', "Content-Type": "application/json" }, body: JSON.stringify(data) })
            .then(res => {
                return res.json();
            })
            .then(resJson => {
                console.log(resJson.result);
                $(`#${element.nama.split(/\W/)
                    .join('')}`)
                    .removeAttr('alt');
            })
            .catch((err) => {
                $(`#${element.nama.split(/\W/)
                    .join('')}`)
                    .removeAttr('alt');
            })
    }
    getVideo(element, nama, e) {
        if ($(`#${nama}`)
            .attr('src') == '#') {
            const uploadLink = element.path;
            const key = `${this._data.uid}_${this._data.anak.split('.').join('')}_${element.nama.split(':').join('')}`.toString();
            const data = {
                requestedID: key,
                requestedURL: uploadLink
            };
            $(`#${nama}`)
                .attr('alt', 'sedangProses');
            this.requestVideoURL(element, data);
            setInterval(() => {
                if ($(`#${nama}`)
                    .attr('alt') != "sedangProses") {
                    return 0;
                } else {
                    this.generateVideoURL(element, nama);
                    $(`#${nama}`)
                        .attr('alt', '');
                }
            }, 500)
            e.stopPropagation();
        }
    }
    render() {
        const db = firebase.firestore();
        const data = { id: this.id, title: "Rekaman Layar" };
        const box = document.createElement("bottom-box");
        box.value = data;
        $(this)
            .append(box);
        const listVideo = document.createElement("div");
        $(listVideo)
            .append(`<style>
            .videoDate {
                overflow-x: scroll;
                height: 27rem;
                margin-top: 2rem;
            }
            
            .videoDate li {
                margin-right: 1.5rem;
            }
            
            .videoDate h4 {
                font-family: 'muli-light';
            }
            .videoDate ul{
                padding-inline-start: 0 !important;
            }
            .videoDate ul video{
                width:300px;
            }
            @media (max-width:800px) {
                .videoDate {
                    height: 50vh;
                    width: 100%;
                    overflow-y: scroll;  
                }
                .videoDate li{
                    margin-top:2rem;
                }
                .videoDate ul video{
                    width:250px;
                    height:150px;
                }
            }
            </style>
            <ul class="d-inline list-video container">
            </ul>`);
        $('.list-video')
            .ready(() => {
                if (this._data.data.prefixes.length != 0) {
                    this._data.data.prefixes.forEach((date, idx) => {
                        const [tanggal, bulan, tahun] = date.name.split('-');
                        const tanggalVideo = new Date(parseInt(tahun), parseInt(bulan) - 1, parseInt(tanggal));
                        const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                        const Bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
                        date.listAll()
                            .then(listApp => {
                                this.createVideoDate(tanggalVideo, hari, Bulan, listApp, idx);
                                this.createVideoList(listApp, idx);
                            })
                    })
                } else {
                    $('.list-video')
                        .append(`<h4 class="py-5">Belum ada informasi untuk ditampilkan</h4>`);
                }
            });
        $(`#${data.id}-content`)
            .append(listVideo);
    }
    videoViewAdjust() {
        $(window)
            .width(function () {
                if ($(window)
                    .width() < 600) {
                    $('.videoDate ul')
                        .removeClass('d-flex')
                        .addClass('d-block');
                    $('.videoDate ul .box')
                        .addClass('text-center')
                        .removeClass('text-left');
                } else {
                    $('.videoDate ul')
                        .addClass('d-flex')
                        .removeClass('d-block');
                    $('.videoDate ul .box')
                        .removeClass('text-center')
                        .addClass('text-left');
                }
            });
        $(window)
            .resize(function () {
                if ($(window)
                    .width() < 600) {
                    $('.videoDate ul')
                        .removeClass('d-flex')
                        .addClass('d-block');
                    $('.videoDate ul .box')
                        .addClass('text-center')
                        .removeClass('text-left');
                } else {
                    $('.videoDate ul')
                        .addClass('d-flex')
                        .removeClass('d-block');
                    $('.videoDate ul .box')
                        .removeClass('text-center')
                        .addClass('text-left');
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


customElements.define("video-app", VideoApp);