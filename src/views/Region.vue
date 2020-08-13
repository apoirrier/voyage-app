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
                <div v-for="(tab, index) in generalTabs" :key="tab.title" class="region_onetab" :style="tabStyle(index+poiTabs.length)" @click="changeTab(index+poiTabs.length)">
                    {{ tab.title }}
                </div>
            </div>
            <div class="region_tab-content" :style="tabStyle(selectedTab)">
                <div v-if="isPoiTab" class="region_tab-content-flex">
                    <Carte v-for="poi in poiTabs[selectedTab].pois" :key="poi.name" 
                        :nextUrl="nextUrl(poi.nextUrl)"
                        :address="poi.address"
                        :image="imageUrl(poi.image)"
                        :rate="poi.rate"
                        :name="poi.name"
                        :type="poiTabs[selectedTab].type" />
                </div>
                <div v-else class="region_general-tab">
                    <span> {{ this.generalTabs[this.selectedTab - this.poiTabs.length].text }} </span>
                    <img v-for="img in this.generalTabs[this.selectedTab - this.poiTabs.length].images" :key="img" :src="imageUrl(img)">
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
            name: "", 
            description: "",
            images: [],
            selectedTab: 0,
            poiTabs: [], 
            generalTabs: []
        }
    },
    async created() {
        this.loadData()
    },
    watch: {
        '$route': 'loadData'
    },
    computed: {
        ...mapState(['colors', 'categoryNames', 'apiAddr', 'imagesLocation']),
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
            return "color: black; background-color: " + this.colors["general"]
        },
        changeTab(id) {
            this.selectedTab = id
        },
        nextUrl(url) {
            return this.$route.fullPath + url
        },
        getCategoryName(type) {
            return this.categoryNames[type]
        },
        imageUrl(localUrl) {
            return this.imagesLocation + localUrl
        },
        async loadData() {
            try {
                const response = await fetch(this.apiAddr + "region/" + this.$route.params.region);
                if(response.status == 404)
                    return this.$router.push('/404');
                const data = await response.json();
                this.name = data.name;
                this.description = data.description;
                this.images = data.images;
                this.generalTabs = data.generalTabs;
                if('restaurants' in data) {
                    this.poiTabs.push({
                        type: "restaurant",
                        pois: data.restaurants
                    })
                }
                if('hotels' in data) {
                    this.poiTabs.push({
                        type: "hotel",
                        pois: data.hotels
                    })
                }
                if('activities' in data) {
                    this.poiTabs.push({
                        type: "activity",
                        pois: data.activities
                    })
                }
            } catch (err) {
                console.log(err);
                return this.$router.push('/404');
            }
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

.region_general-tab {
    display: flex;
    flex-direction: column;
    text-align: justify;
    justify-content: center;
    padding: 30px;
}

.region_general-tab img {
    margin-top: 20px;
    height: auto;
    width: 100%;
}

</style>