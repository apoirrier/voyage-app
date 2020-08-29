<template>
<div>
    <div class="list_region">
        <button @click="createRegion"> Ajouter une région </button>
    </div>
    <div id="mapContainer" class="basemap"></div>
</div>
</template>

<script>
import Parse from 'parse'
import mapboxgl from "mapbox-gl";

export default {
    name: "Home",
    data() {
        return {
            regions: [],
            map: null
        }
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
    },
    created() {
        this.loadData();
    },
    watch: {
        '$route': 'loadData'
    },
    methods: {
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
        async createRegion() {
            this.$prompt("Nouvelle région").then( (name) => {
                if(name === undefined || name === "")
                    return;
                Parse.Cloud.run("createRegion", {name: name}).then( (answer) => {
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
                    this.loadData();
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
        },
        imageUrl(image) {
            if(image === undefined)
                return "images/undefined"
            return image.url();
        },
    }
}
</script>

<style lang="scss">
.list_region {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.list_region button {
    width: fit-content;
    margin: 10px;
}

.basemap {
  width: 100%;
  height: 100vh;
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