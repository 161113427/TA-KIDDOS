import "./bottom-box.js"

class LocationApp extends HTMLElement {
    set data(val) {
        this._data = val;
    }
    connectedCallback() {
        this.id = this.getAttribute('id') || null;
        this.render();
    }

    pos(lng, lat) {
        const token = 'pk.eyJ1Ijoia2lkZG9zdGEiLCJhIjoiY2tjMzhrMzVsMDl0aDJ2cDNyNHB2aXk1ZCJ9.jsFKSTK8sflOBy4Cf-V1Ig'
        return fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=poi&access_token=${token}`)
            .then(res => {
                return res.json();
            })
            .then(responseJson => {
                return new Promise((resolve, reject) => {
                    responseJson.features.length != 0 ? resolve(responseJson) : resolve(undefined);
                })

            })
    }

    map() {
        mapboxgl.accessToken = 'pk.eyJ1Ijoia2lkZG9zdGEiLCJhIjoiY2tjMzhrMzVsMDl0aDJ2cDNyNHB2aXk1ZCJ9.jsFKSTK8sflOBy4Cf-V1Ig';
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
            center: [this._data.lng, this._data.lat], // starting position [lng, lat]
            zoom: 16 // starting zoom
        });
        this.pos(this._data.lng, this._data.lat)
            .then((result) => {
                if (result !== undefined && result.features[0].place_name !== "") {
                    //Put Marker here
                    const marker = new mapboxgl.Marker()
                        .setLngLat([this._data.lng, this._data.lat])
                        .setPopup(new mapboxgl.Popup({ offset: 25 })
                            .setHTML(`<h5><strong>Lokasi ${this._data.namaAnak}</strong></h5><p>Saat ini ${this._data.namaAnak} sedang berada di ${result.features[0].place_name}</p>`))
                        .addTo(map);
                } else {
                    const marker = new mapboxgl.Marker()
                        .setLngLat([this._data.lng, this._data.lat])
                        .setPopup(new mapboxgl.Popup({ offset: 25 })
                            .setHTML(`<h5><strong>Lokasi ${this._data.namaAnak}</strong></h5><p>Alamat lokasi ${this._data.namaAnak} saat ini belum tersedia</p>`))
                        .addTo(map);
                }
            });
        map.addControl(new mapboxgl.NavigationControl());
    }
    render() {
        const data = { id: this.id, title: "Lokasi Anak" };
        const box = document.createElement("bottom-box");
        const map = document.createElement('div');
        box.value = data;
        map.setAttribute("id", "map");
        map.setAttribute("class", "w-100 h-70 pb-3");
        $(this)
            .append(box);
        if (this._data.lng == -101.073324 && this._data.lat == 38.685516) {
            $(`#${data.id}-content`)
                .append('<h4 class="py-5">Belum ada informasi untuk ditampilkan</h4>');
        } else {
            this.pos(this._data.lng, this._data.lat)
                .then((result) => {
                    const jam = new Date(this._data.updateTime)
                        .getHours();
                    const menit = new Date(this._data.updateTime)
                        .getMinutes();
                    const tanggal = new Date(this._data.updateTime)
                        .getDate();
                    const bulan = new Date(this._data.updateTime)
                        .getMonth();
                    const tahun = new Date(this._data.updateTime)
                        .getFullYear()
                        .toString()
                        .slice(2, 4);
                    if (result !== undefined && result.features[0].place_name != "") {
                        //Put Marker here
                        $(`#${data.id}-content`)
                            .append(`<style>
                            input[name="zoomIn"],input[name="zoomOut"]{
                                font-family:"raleway-black'
                                font-size:18sp;
                                
                            }
                            .update-time{
                                position:fixed;
                                border-radius:14px;
                                z-index:1;
                                font-size:0.85rem;
                                font-family:'Roboto';
                                background:white;
                                width:14rem;
                                font-weight:600;
                                text-align:center;
                            }
                            </style>
                            <div class="position text-left mt-5">
                                <h5 class="mb-3"><strong>${this._data.namaAnak}</strong></h5>
                                <div class="d-flex mb-3">
                                    <p><span><ion-icon name="location-sharp" style="color:red;"></ion-icon></span> Alamat lokasi : <strong>${result.features[0].place_name}</strong></p>
                                </div>
                                <div class="update-time mt-4 py-2 shadow"> Dimutakhirkan ${tanggal}/${bulan}/${tahun}, ${jam} : ${menit} </div>
                            </div>`, map)
                    } else {
                        $(`#${data.id}-content`)
                            .append(`<style>
                            input[name="zoomIn"],input[name="zoomOut"]{
                                font-family:"raleway-black'
                                font-size:18sp;
                                
                            }
                            .update-time{
                                position:fixed;
                                border-radius:14px;
                                z-index:1;
                                font-size:0.85rem;
                                font-family:'Roboto';
                                background:white;
                                width:14rem;
                                font-weight:600;
                                text-align:center;
                            }
                            </style>
                            <div class="position text-left mt-5">
                                <h5 class="mb-3"><strong>${this._data.namaAnak}</strong></h5>
                                <div class="d-flex mb-3">
                                    <p><span><ion-icon name="location-sharp" style="color:red;"></ion-icon></span> Alamat lokasi : <strong>Alamat lokasi anak belum tersedia</strong></p>
                                </div>
                                <div class="update-time mt-4 py-2 shadow"> Dimutakhirkan ${tanggal}/${bulan}/${tahun}, ${jam} : ${menit} </div>
                            </div>`, map)
                    }
                });
            $(`#${data.id}-content`)
                .append(map);
            this.map();
        }
    }
}


customElements.define("location-app", LocationApp);