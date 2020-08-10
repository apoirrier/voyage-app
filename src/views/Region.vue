<template>
    <div class=region>
        <NavigationBar :name="name" />
        <ImageSlider :images="images" :altText="name" />

        <h1> {{ name }} </h1>
        <p class="region_description"> {{ description}} </p>

        <div class="region_flexbox">
            <div class="region_tabs">
                <div :class="tabStyle(0)" @click="changeTab(0)">
                    Restaurants
                </div>
                <div :class="tabStyle(1)" @click="changeTab(1)">
                    Hôtels
                </div>
            </div>
            <div class="region_tab-content">
                <router-link style="color: #fefefe;" :to="nextUrl"> Schauenstein Schloss </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import NavigationBar from '../components/NavigationBar.vue'
import ImageSlider from '../components/ImageSlider.vue'

export default {
    name: "Region",
    components: {
        NavigationBar,
        ImageSlider
    },
    data() {
        return {
            name: 'Graubünden', 
            description: "Graubünden, a canton in eastern Switzerland, is known for its dramatic Alpine scenery and winter sports. St. Moritz, an upscale resort town and Winter Olympics host in 1928 and 1948, offers ski runs, an outdoor ice rink and ski jumping. Davos, home to the annual World Economic Forum, is also popular for skiing and hiking. The Engadin Valley has traditional whitewashed houses decorated with sgraffito plasterwork.",
            images: ['grisons1.jpg', 'grisons2.jpg', 'grisons3.jpg', 'grisons4.jpg'],
            selectedTab: 0,
        }
    },
    computed: {
        nextUrl() {
            return this.$route.fullPath + "/schauenstein"
        },
    },
    methods: {
        tabStyle(id) {
            if(id == this.selectedTab)
                return "region_onetab region_tab-selected"
            return "region_onetab"
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
    background-color: blue;
    padding: 10px;
    color: #fefefe;
    border-radius: 10px 10px 0 0;
    cursor: pointer;
    text-align: center;
    width: 10%;
}

.region_tab-selected {
    background-color: darkblue;
}

.region_tab-content {
    background-color: darkblue;
    border-radius: 0 10px 0 0;
    min-height: 100px;
    color: #fefefe;
}

.region_description {
    text-align: justify;
    margin-bottom: 30px;
}

</style>