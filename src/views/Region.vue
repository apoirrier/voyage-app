<template>
    <div class=region>
        <NavigationBar :name="name" />
        <ImageSlider :images="images" :altText="name" />

        <h1> {{ name }} </h1>
        <p class="region_description"> {{ description}} </p>

        <div class="region_flexbox">
            <div class="region_tabs">
                <div v-for="(tab, index) in poiTabs" :key="tab.name" class="region_onetab" :style="tabStyle(index)" @click="changeTab(index)">
                    {{ tab.name }}
                </div>
                <div v-for="(tab, index) in generalTabs" :key="tab.name" class="region_onetab" :style="tabStyle(index+poiTabs.length)" @click="changeTab(index+poiTabs.length)">
                    {{ tab.name }}
                </div>
            </div>
            <div class="region_tab-content" :style="tabStyle(selectedTab)">
                <router-link :to="nextUrl"> Schauenstein Schloss </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import NavigationBar from '../components/NavigationBar.vue'
import ImageSlider from '../components/ImageSlider.vue'
import { mapState } from 'vuex'

export default {
    name: "Region",
    components: {
        NavigationBar,
        ImageSlider
    },
    data() {
        return {
            name: 'Graubünden', 
            description: "Graubünden (les Grisons en français), est un canton à l'Est de la Suisse, connu pour ses magnifiques paysages alpins et les sports d'hiver. St. Moritz, ville olympique d'hiver en 1928 et 1948, propose de nombreuses activités en été comme en hiver. Davos est aussi populaire pour le ski et la randonnée. La ville acceuille chaque année le Forum économique mondial. La Vallée de l'Engadine est typiquement Suisse, avec un paysage très vert, des passes et cols complètement au naturel et des villages comportant les maisons traditionnelles décorées par sgraffite.",
            images: ['grisons1.jpg', 'grisons2.jpg', 'grisons3.jpg', 'grisons4.jpg'],
            selectedTab: 0,
            poiTabs: [
                {
                    name: "Restaurants",
                    type: "restaurant"
                },
                {
                    name: "Hôtels",
                    type: "hotel"
                }
            ], 
            generalTabs: [
                {
                    name: "Conseils",
                    type: "tips"
                }
            ]
        }
    },
    computed: {
        nextUrl() {
            return this.$route.fullPath + "/schauenstein"
        },
        ...mapState(['colors'])
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

.region_description {
    text-align: justify;
    margin-bottom: 30px;
}

</style>