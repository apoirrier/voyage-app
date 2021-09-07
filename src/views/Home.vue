<template>
<div class="home">
    <NavigationBar @login-change="changeLogin"/>
    <div id="mapContainer" class="basemap">
        <div v-if="loggedIn" class="new_region" @click="newRegionClicked">
            <svg viewBox="0 0 512 512">
                <path d="M257,0C116.39,0,0,114.39,0,255s116.39,257,257,257s255-116.39,255-257S397.61,0,257,0z M392,285H287v107 c0,16.54-13.47,30-30,30c-16.54,0-30-13.46-30-30V285H120c-16.54,0-30-13.46-30-30c0-16.54,13.46-30,30-30h107V120 c0-16.54,13.46-30,30-30c16.53,0,30,13.46,30,30v105h105c16.53,0,30,13.46,30,30S408.53,285,392,285z" />
            </svg>
        </div>
    </div>
</div>
</template>

<script>
import Parse from 'parse'
import mapboxgl from "mapbox-gl";
import NavigationBar from '../components/NavigationBar.vue'
import imgur from "../mixins/imgur.ts"
import parse from "../mixins/parse.ts"


export default {
    name: "Home",
    components: {
        NavigationBar
    },
    mixins: [imgur, parse],
    data() {
        return {
            regions: [],
            map: null,
            loggedIn: Parse.User.current() != undefined,
            mouseMarker: null,
            isAddingMarker: false,
            markersAdded: false
        }
    },
    mounted() {
        mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_TOKEN;
        this.map = new mapboxgl.Map({
            container: "mapContainer",
            style: "mapbox://styles/mapbox/outdoors-v11",
            zoom: 1.5
        });

        const nav = new mapboxgl.NavigationControl();
        this.map.addControl(nav, "bottom-right");

        this.map.on("load", this.addMarkers);
        this.map.on("click", this.clickOnMap);

        // Capture escape key to cancel add
        const self = this;
        window.addEventListener('keyup', function(ev) {
            if(ev.key == 'Escape')
                self.pressEscape();
        });
        if(localStorage.lastTab)
            localStorage.removeItem("lastTab");
    },
    created() {
        this.loadData();
    },
    watch: {
        '$route': 'loadData'
    },
    methods: {
        changeLogin(newValue) {
            this.loggedIn = newValue;
        },
        loadData() {
            this.callParse("listRegion", undefined, (answer) => {
                this.regions = answer.regions;
                this.addMarkers();
            }, this);
        },
        async createRegion(coordinates) {
            this.$prompt("Nouvelle région").then( (name) => {
                if(name === undefined || name === "")
                    return;
                this.callParse("createRegion", {name: name, coordinates: coordinates}, () => {
                    const id = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').join('-').toLowerCase();
                    this.$router.push((this.$route.fullPath + "/world/" + id + "?edit=1").split("//").join("/"));
                }, this);
            });
            this.pressEscape();
        },
        addMarkers() {
            if(this.regions.length == 0)
                return;
            if(this.markersAdded)
                return;
            this.markersAdded = true;
            this.regions.forEach(region => {
                const popup = new mapboxgl.Popup({maxWidth: '300px', offset: 25})
                    .setHTML("<a href='#/world/" + region.url + 
                             "'> <img src=" + this.getImageUrl(region.image) + 
                             "> <h1> " + this.escapeHTML(region.name) + " </h1> </a>");
                new mapboxgl.Marker().setLngLat(region.coordinates).setPopup(popup).addTo(this.map);
            });
            this.mouseMarker = new mapboxgl.Marker();
            this.mouseMarker.setLngLat([0,0]);
            this.map.on("mousemove", (e) => {
                if(this.isAddingMarker)
                    this.mouseMarker.setLngLat(e.lngLat);
            });
        },
        escapeHTML(input) {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                "/": '&#x2F;',
            };
            const reg = /[&<>"'/]/ig;
            return input.replace(reg, (match)=>(map[match]));
        },
        async clickOnMap(e) {
            if(this.isAddingMarker) {
                this.isAddingMarker = false;
                this.createRegion([e.lngLat.lng, e.lngLat.lat]);
            }
        },
        newRegionClicked() {
            this.isAddingMarker = true;
            this.mouseMarker.addTo(this.map);
        },
        pressEscape() {
            this.isAddingMarker = false;
            this.mouseMarker.remove();
        }
    }
}
</script>

<style lang="scss">
.home {
    display: flex;
    flex-direction: column;
}

.new_region {
    cursor: pointer;
    opacity: 0.6;
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 1;
}

.new_region:hover {
    opacity: 1;
}

.new_region svg {
    width: 40px;
    fill: rgb(84, 165, 241);;
}

.basemap {
  position: absolute;
  width: 100%;
  height: calc(100vh - 50px);
  bottom: 0;
  left: 0;
}

.mapboxgl-popup-content {
    display: flex;
    cursor: pointer;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.mapboxgl-popup-content img {
    width: 300px;
    height: 125px;
    object-fit: cover;
    float: center;
    margin-left: -10px;
    margin-top: -10px;
    border-radius: 3px 3px 0 0;
}

.mapboxgl-popup-content h1 {
    margin-bottom: -10px;
    margin-top: 1px;
}

.mapboxgl-popup-close-button {
    display: none;
}

.mapboxgl-popup-tip {
    display: none;
}

.mapboxgl-marker {
    cursor: pointer;
}

.marker {
    cursor: pointer;
}
</style>