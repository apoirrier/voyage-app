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
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import NavigationBar from '../components/NavigationBar.vue'
import imgur from "../mixins/imgur.ts"
import parse from "../mixins/parse.ts"
import VueSimpleAlert from 'vue3-simple-alert'

const REGIONS_SOURCE_ID = 'regions';
const LAYER_CLUSTERS = 'regions-clusters';
const LAYER_CLUSTER_COUNT = 'regions-cluster-count';
const LAYER_UNCLUSTERED = 'regions-unclustered';
const CLUSTER_COLOR = 'rgb(84, 165, 241)';
const CLUSTER_MAX_ZOOM = 14;
const CLUSTER_RADIUS = 50;
const UNCLUSTERED_SYNC_DELAY_MS = 120;
const POPUP_MAX_WIDTH_MOBILE = '90vw';
const POPUP_MAX_WIDTH_DESKTOP = '300px';

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
            regionClustersInitialized: false,
            mouseMarkerInitialized: false,
        }
    },
    mounted() {
        mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_TOKEN;
        this.map = new mapboxgl.Map({
            container: "mapContainer",
            style: "mapbox://styles/mapbox/outdoors-v11",
            zoom: 1.5
        });

        const language = new MapboxLanguage({defaultLanguage: 'fr'});
        this.map.addControl(language);

        const nav = new mapboxgl.NavigationControl();
        this.map.addControl(nav, "bottom-right");

        this.map.on("load", this.onMapLoad);
        this.map.on("click", this.clickOnMap);

        window.addEventListener('keyup', this.handleEscapeKey);
        if(localStorage.lastTab)
            localStorage.removeItem("lastTab");
    },
    created() {
        this.regionMarkersByKey = new Map();
        this.unclusteredSyncTimer = null;
        this.activeRegionMarker = null;
        this.handleEscapeKey = (ev) => {
            if (ev.key == 'Escape')
                this.pressEscape();
        };
        this.loadData();
    },
    watch: {
        '$route': 'loadData'
    },
    beforeUnmount() {
        if (this.unclusteredSyncTimer != null) {
            clearTimeout(this.unclusteredSyncTimer);
            this.unclusteredSyncTimer = null;
        }
        window.removeEventListener('keyup', this.handleEscapeKey);
        if (this.map) {
            this.map.off('moveend', this.scheduleUnclusteredSync);
            this.map.off('zoomend', this.scheduleUnclusteredSync);
        }
        if (this.regionMarkersByKey) {
            this.regionMarkersByKey.forEach((m) => m.remove());
            this.regionMarkersByKey.clear();
        }
    },
    methods: {
        changeLogin(newValue) {
            this.loggedIn = newValue;
        },
        loadData() {
            this.callParse("listRegion", undefined, (answer) => {
                this.regions = answer.regions;
                this.syncRegionsToMap();
            }, this);
        },
        onMapLoad() {
            this.setupMouseMarker();
            this.syncRegionsToMap();
        },
        buildRegionsGeoJSON() {
            return {
                type: 'FeatureCollection',
                features: this.regions.map((region) => ({
                    type: 'Feature',
                    properties: {
                        name: region.name,
                        url: region.url,
                        image: region.image,
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: region.coordinates,
                    },
                })),
            };
        },
        setupMouseMarker() {
            if (this.mouseMarkerInitialized)
                return;
            this.mouseMarkerInitialized = true;
            this.mouseMarker = new mapboxgl.Marker();
            this.mouseMarker.setLngLat([0, 0]);
            this.map.on("mousemove", (e) => {
                if (this.isAddingMarker)
                    this.mouseMarker.setLngLat(e.lngLat);
            });
        },
        initRegionClusterLayers() {
            if (this.regionClustersInitialized)
                return;
            this.regionClustersInitialized = true;

            this.map.addSource(REGIONS_SOURCE_ID, {
                type: 'geojson',
                data: { type: 'FeatureCollection', features: [] },
                cluster: true,
                clusterMaxZoom: CLUSTER_MAX_ZOOM,
                clusterRadius: CLUSTER_RADIUS,
            });

            this.map.addLayer({
                id: LAYER_CLUSTERS,
                type: 'circle',
                source: REGIONS_SOURCE_ID,
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': CLUSTER_COLOR,
                    'circle-radius': 22,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff',
                },
            });

            this.map.addLayer({
                id: LAYER_CLUSTER_COUNT,
                type: 'symbol',
                source: REGIONS_SOURCE_ID,
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': ['get', 'point_count'],
                    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                    'text-size': 14,
                },
                paint: {
                    'text-color': '#ffffff',
                },
            });

            // Invisible hit target so clustering still decides which points are “unclustered”;
            // actual pins are synced as mapboxgl.Marker (default DOM pin) in syncUnclusteredMarkers.
            this.map.addLayer({
                id: LAYER_UNCLUSTERED,
                type: 'circle',
                source: REGIONS_SOURCE_ID,
                filter: ['!', ['has', 'point_count']],
                paint: {
                    'circle-opacity': 0,
                    'circle-radius': 18,
                    'circle-stroke-width': 0,
                },
            });

            const setPointer = () => { this.map.getCanvas().style.cursor = 'pointer'; };
            const clearPointer = () => { this.map.getCanvas().style.cursor = ''; };

            [LAYER_CLUSTERS, LAYER_CLUSTER_COUNT].forEach((id) => {
                this.map.on('mouseenter', id, setPointer);
                this.map.on('mouseleave', id, clearPointer);
            });

            this.map.on('moveend', this.scheduleUnclusteredSync);
            this.map.on('zoomend', this.scheduleUnclusteredSync);

            this.map.on('click', LAYER_CLUSTERS, (e) => {
                const features = this.map.queryRenderedFeatures(e.point, { layers: [LAYER_CLUSTERS] });
                if (!features.length)
                    return;
                const clusterId = features[0].properties.cluster_id;
                const source = this.map.getSource(REGIONS_SOURCE_ID);
                source.getClusterExpansionZoom(clusterId, (err, zoom) => {
                    if (err)
                        return;
                    this.map.easeTo({
                        center: features[0].geometry.coordinates,
                        zoom: zoom,
                    });
                });
            });

        },
        scheduleUnclusteredSync() {
            if (this.unclusteredSyncTimer != null)
                clearTimeout(this.unclusteredSyncTimer);
            this.unclusteredSyncTimer = setTimeout(() => {
                this.unclusteredSyncTimer = null;
                this.syncUnclusteredMarkers();
            }, UNCLUSTERED_SYNC_DELAY_MS);
        },
        getPopupMaxWidth() {
            return (typeof window !== 'undefined' && window.innerWidth && window.innerWidth < 480)
                ? POPUP_MAX_WIDTH_MOBILE
                : POPUP_MAX_WIDTH_DESKTOP;
        },
        getRegionMarkerKey(url, coordinates) {
            return url + '@' + coordinates[0] + ',' + coordinates[1];
        },
        closeActiveRegionPopup() {
            if (!this.activeRegionMarker)
                return;
            const popup = this.activeRegionMarker.getPopup();
            if (popup)
                popup.remove();
            this.activeRegionMarker = null;
        },
        removeRegionMarker(key) {
            const marker = this.regionMarkersByKey.get(key);
            if (!marker)
                return;
            if (this.activeRegionMarker === marker)
                this.activeRegionMarker = null;
            marker.remove();
            this.regionMarkersByKey.delete(key);
        },
        buildRegionPopup(props) {
            return new mapboxgl.Popup({ maxWidth: this.getPopupMaxWidth(), offset: 25 })
                .setHTML(
                    "<a class='popup-link' href='/world/" + props.url + "'>" +
                    "<div class='popup-card'>" +
                    "<img class='popup-image' src='" + this.getImageUrl(props.image) + "' alt='" + this.escapeHTML(props.name) + "'/>" +
                    "<div class='popup-title'>" + this.escapeHTML(props.name) + "</div>" +
                    "</div></a>"
                );
        },
        attachLazyRegionPopup(marker, props) {
            const el = marker.getElement();
            if (el.dataset.lazyPopupBound === '1')
                return;
            el.dataset.lazyPopupBound = '1';
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!marker.getPopup()) {
                    const popup = this.buildRegionPopup(props);
                    popup.on('close', () => {
                        if (this.activeRegionMarker === marker)
                            this.activeRegionMarker = null;
                    });
                    marker.setPopup(popup);
                }

                if (this.activeRegionMarker !== marker)
                    this.closeActiveRegionPopup();

                marker.togglePopup();
                const popup = marker.getPopup();
                this.activeRegionMarker = (popup && popup.isOpen && popup.isOpen()) ? marker : null;
            });
        },
        syncUnclusteredMarkers() {
            if (!this.map || !this.regionClustersInitialized)
                return;
            const canvas = this.map.getCanvas();
            const features = this.map.queryRenderedFeatures(
                [[0, 0], [canvas.width, canvas.height]],
                { layers: [LAYER_UNCLUSTERED] }
            );
            const seen = new Set();
            const nextKeys = new Set();
            const pending = [];
            features.forEach((f) => {
                const coords = f.geometry.coordinates;
                const key = this.getRegionMarkerKey(f.properties.url, coords);
                if (seen.has(key))
                    return;
                seen.add(key);
                nextKeys.add(key);
                pending.push({ key, coords, props: f.properties });
            });
            pending.forEach(({ key, coords, props }) => {
                let marker = this.regionMarkersByKey.get(key);
                if (!marker) {
                    marker = new mapboxgl.Marker()
                        .setLngLat(coords)
                        .addTo(this.map);
                    this.attachLazyRegionPopup(marker, props);
                    this.regionMarkersByKey.set(key, marker);
                } else {
                    marker.setLngLat(coords);
                }
            });
            for (const key of Array.from(this.regionMarkersByKey.keys())) {
                if (!nextKeys.has(key))
                    this.removeRegionMarker(key);
            }
        },
        syncRegionsToMap() {
            if (!this.map || !this.map.isStyleLoaded())
                return;
            if (!this.regionClustersInitialized)
                this.initRegionClusterLayers();
            this.map.getSource(REGIONS_SOURCE_ID).setData(this.buildRegionsGeoJSON());
            this.map.once('idle', this.scheduleUnclusteredSync);
        },
        async createRegion(coordinates) {
            VueSimpleAlert.prompt("Nouvelle région").then( (name) => {
                if(name === undefined || name === "")
                    return;
                this.callParse("createRegion", {name: name, coordinates: coordinates}, () => {
                    const id = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').join('-').toLowerCase();
                    this.$router.push((this.$route.fullPath + "/world/" + id + "?edit=1").split("//").join("/"));
                }, this);
            });
            this.pressEscape();
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
                return;
            }
            this.closeActiveRegionPopup();
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
    fill: rgb(84, 165, 241);
}

.basemap {
  position: absolute;
  width: 100%;
  height: calc(100vh - 50px);
  bottom: 0;
  left: 0;
}

.mapboxgl-popup-content {
    display: block;
    padding: 0;
    cursor: pointer;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.mapboxgl-popup-content .popup-card {
    display: flex;
    flex-direction: column;
    width: 300px;
    max-width: 100%;
}

.mapboxgl-popup-content .popup-image {
    width: 100%;
    height: 125px;
    object-fit: cover;
    display: block;
    border-radius: 3px 3px 0 0;
}

.mapboxgl-popup-content .popup-title {
    background: #ffffff;
    padding: 6px 10px;
    color: #111;
    font-weight: 700;
    font-size: 20px;
    margin: 0;
    line-height: 1.2;
    border-radius: 0 0 3px 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

@media (max-width: 479px) {
    .mapboxgl-popup-content .popup-card {
        width: 65vw;
    }
    .mapboxgl-popup-content .popup-title {
        font-size: 18px;
    }
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
