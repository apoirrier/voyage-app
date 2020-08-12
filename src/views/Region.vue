<template>
    <div class=region>
        <NavigationBar :name="name" />
        <ImageSlider :images="images" :altText="name" />

        <h1> {{ name }} </h1>
        <p class="region_description"> {{ description}} </p>

        <div class="region_flexbox">
            <div class="region_tabs">
                <div v-for="(tab, index) in poiTabs" :key="tab.type" class="region_onetab" :style="tabStyle(index)" @click="changeTab(index)">
                    {{ getCategoryName(tab.type) }}
                </div>
                <div v-for="(tab, index) in generalTabs" :key="tab.type" class="region_onetab" :style="tabStyle(index+poiTabs.length)" @click="changeTab(index+poiTabs.length)">
                    {{ getCategoryName(tab.type) }}
                </div>
            </div>
            <div class="region_tab-content" :style="tabStyle(selectedTab)">
                <div v-if="isPoiTab" class="region_tab-content-flex">
                    <Carte v-for="poi in poiTabs[selectedTab].pois" :key="poi.name" 
                        :nextUrl="nextUrl(poi.nextUrl)"
                        :address="poi.address"
                        :image="poi.image"
                        :rate="poi.rate"
                        :name="poi.name"
                        :type="poiTabs[selectedTab].type" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import NavigationBar from '../components/NavigationBar.vue'
import ImageSlider from '../components/ImageSlider.vue'
import Carte from '../components/Carte.vue'
import { mapState } from 'vuex'

export default {
    name: "Region",
    components: {
        NavigationBar,
        ImageSlider,
        Carte
    },
    data() {
        return {
            name: 'Graubünden', 
            description: "Graubünden (les Grisons en français), est un canton à l'Est de la Suisse, connu pour ses magnifiques paysages alpins et les sports d'hiver. St. Moritz, ville olympique d'hiver en 1928 et 1948, propose de nombreuses activités en été comme en hiver. Davos est aussi populaire pour le ski et la randonnée. La ville acceuille chaque année le Forum économique mondial. La Vallée de l'Engadine est typiquement Suisse, avec un paysage très vert, des passes et cols complètement au naturel et des villages comportant les maisons traditionnelles décorées par sgraffite.",
            images: ['grisons1.jpg', 'grisons2.jpg', 'grisons3.jpg', 'grisons4.jpg'],
            selectedTab: 0,
            poiTabs: [
                {
                    type: "restaurant",
                    pois: [
                        {
                            nextUrl: "/schauenstein",
                            image: "images/schauenstein_ext.jpeg",
                            name: "Schauenschtein Schloss",
                            address: "address space that is very incredibly long a,d that I do not like",
                            rate: 3,
                        },
                        {
                            nextUrl: "/schauenstein",
                            image: "images/schauenstein_ext.jpeg",
                            name: "Schauenschtein",
                            address: "address space",
                            rate: 3,
                        },
                        {
                            nextUrl: "/schauenstein",
                            image: "images/schauenstein_ext.jpeg",
                            name: "Schauenschtein",
                            address: "address space",
                            rate: 3,
                        }
                    ]
                },
                {
                    type: "hotel",
                    pois: []
                }
            ], 
            generalTabs: [
                {
                    type: "tips"
                }
            ]
        }
    },
    computed: {
        ...mapState(['colors', 'categoryNames']),
        isPoiTab() {
            return this.selectedTab < this.poiTabs.length
        }
    },
    methods: {
        tabStyle(id) {
            if(id != this.selectedTab)
                return "background-color: darkgrey"
            if(id < this.poiTabs.length)
                return "background-color: " + this.colors[this.poiTabs[id].type]
            return "background-color: " + this.colors[this.generalTabs[id-this.poiTabs.length].type]
        },
        changeTab(id) {
            this.selectedTab = id
        },
        nextUrl(url) {
            return this.$route.fullPath + url
        },
        getCategoryName(type) {
            return this.categoryNames[type]
        }
    }
}
</script>

<style lang="scss">
.region {
    padding: 20px;
}

.region_flexbox {
    display: flex;
    flex-direction: column;
}

.region_tabs {
    display: flex;
    flex-direction: row;
    height: 30px;
}

.region_onetab {
    padding: 10px;
    color: #fefefe;
    border-radius: 10px 10px 0 0;
    cursor: pointer;
    text-align: center;
    width: 10%;
    margin-right: 10px;
}

.region_tab-content {
    border-radius: 0 10px 0 0;
    min-height: 100px;
    color: #fefefe;
}

.region_tab-content-flex {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: flex-start;
}

.region_description {
    text-align: justify;
    margin-bottom: 30px;
}

</style>