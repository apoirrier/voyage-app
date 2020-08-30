<template>
<div class="home">
    <NavigationBar @login-change="changeLogin"/>
    <button v-if="loggedIn" class="new_region" @click="newRegionClicked"> Nouvelle région </button>
    <div id="mapContainer" class="basemap"></div>
</div>
</template>

<script>
import Parse from 'parse'
import mapboxgl from "mapbox-gl";
import { mapState } from 'vuex'
import NavigationBar from '../components/NavigationBar.vue'

export default {
    name: "Home",
    components: {
        NavigationBar
    },
    data() {
        return {
            regions: [],
            map: null,
            loggedIn: Parse.User.current() != undefined,
            mouseMarker: null,
            isAddingMarker: false,
        }
    },
    computed: {
        ...mapState["mapboxToken"]
    },
    mounted() {
        mapboxgl.accessToken = "pk.eyJ1IjoiYXBvaXJyaWVyIiwiYSI6ImNrZWc2NDRzbDB3dTEycm95M3E2bzJnOXIifQ.K5jGE4KPX3QQdKZ32sB1hw";
        this.map = new mapboxgl.Map({
            container: "mapContainer",
            style: "mapbox://styles/mapbox/outdoors-v11",
            zoom: 1.5
        });

        const nav = new mapboxgl.NavigationControl();
        this.map.addControl(nav, "bottom-right");

        this.map.on("load", this.addMarkers);
        this.map.on("click", this.clickOnMap);
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
            Parse.Cloud.run("listRegion").then( (answer) => {
                if(answer === undefined || answer.code >= 500) {
                    this.$alert("Error while trying to contact server... Please try again or contact an admin");
                    return;
                } else if(answer.code !== 200) {
                    this.$alert("Unknown error: code " + answer.code);
                    return;
                }
                this.regions = answer.regions;
            });
        },
        async createRegion(coordinates) {
            this.$prompt("Nouvelle région").then( (name) => {
                if(name === undefined || name === "")
                    return;
                Parse.Cloud.run("createRegion", {name: name, coordinates: coordinates}).then( (answer) => {
                    if(answer === undefined || answer.code >= 500) {
                        this.$alert("Error while trying to contact server... Please try again or contact an admin");
                        return;
                    } else if(answer.code === 403) {
                        this.$alert("User unauthorized, please log in");
                        return;
                    } else if(answer.code === 400) {
                        this.$alert("Error creating region: " + answer.error);
                        return;
                    }
                    else if(answer.code !== 200) {
                        this.$alert("Unknown error: code " + answer.code);
                        return;
                    }
                    const id = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').join('-').toLowerCase();
                    return this.$router.push((this.$route.fullPath + "/world/" + id + "?edit=1").split("//").join("/"));
                });
            });
        },
        addMarkers() {
            this.regions.forEach(region => {
                const popup = new mapboxgl.Popup({maxWidth: '300px', className: 'popup'})
                    .setHTML("<a href='#/world/" + region.url + 
                             "'> <img src=" + this.imageUrl(region.image) + 
                             "> <h1> " + region.name + " </h1> </a>");
                new mapboxgl.Marker().setLngLat(region.coordinates).setPopup(popup).addTo(this.map);
            });
            this.mouseMarker = new mapboxgl.Marker();
            this.mouseMarker.setLngLat([0,0]);
            this.map.on("mousemove", (e) => {
                if(this.isAddingMarker)
                    this.mouseMarker.setLngLat(e.lngLat);
            });
        },
        imageUrl(image) {
            if(image === undefined)
                return "images/undefined"
            return image.url();
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
    width: fit-content;
    margin: 10px;
    align-self: center;
    margin: 0;
}

.basemap {
  width: 100%;
  height: calc(100vh - 70px);
  margin-top: 10px;
}

.popup {
    display: flex;
    cursor: pointer;
}

.popup img {
    width: 300px;
    height: 125px;
    object-fit: cover;
    float: center;
    margin-left: -10px;
    margin-top: -10px;
}

.popup h1 {
    margin: 5px;
}

.marker {
    cursor: pointer;
}
</style>