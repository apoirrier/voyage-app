<template>
    <div class=region>
        <NavigationBar :name="name" />
        <ImageSlider :images="images" :altText="name" />

        <div style="display: flex; align-items: center; justify-content: space-between;">
            <div/>
            <h1> {{ name }} </h1>
            <img v-if="isEditing" src="images/edit_active.png" class="edit_button edit_button_active" @click="toggleEdit">
            <img v-else src="images/edit.png" class="edit_button" @click="toggleEdit">
        </div>

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
                    <div v-for="(poi, idx) in poiTabs[selectedTab].pois" :key="poi.name" style="position: relative;">
                        <Carte :nextUrl="nextUrl(poi.nextUrl)"
                            :address="poi.address"
                            :image="imageUrl(poi.image)"
                            :rate="poi.rate"
                            :name="poi.name"
                            :type="poiTabs[selectedTab].type" />
                        <div v-if="isEditing" class="cross_close" @click="removePoi(poi.nextUrl, idx)"> X </div>
                    </div>
                    <div v-if="isEditing" class="region_newpoi" @click="createPoi">
                        <svg viewBox="0 0 512 512">
                            <path stroke-width="3" d="M256,0C114.833,0,0,114.833,0,256s114.833,256,256,256s256-114.853,256-256S397.167,0,256,0z M256,472.341 c-119.275,0-216.341-97.046-216.341-216.341S136.725,39.659,256,39.659S472.341,136.705,472.341,256S375.295,472.341,256,472.341z" />
                            <path stroke-width="3" d="M355.148,234.386H275.83v-79.318c0-10.946-8.864-19.83-19.83-19.83s-19.83,8.884-19.83,19.83v79.318h-79.318 c-10.966,0-19.83,8.884-19.83,19.83s8.864,19.83,19.83,19.83h79.318v79.318c0,10.946,8.864,19.83,19.83,19.83 s19.83-8.884,19.83-19.83v-79.318h79.318c10.966,0,19.83-8.884,19.83-19.83S366.114,234.386,355.148,234.386z" />
                        </svg>
                    </div>
                </div>
                <div v-else class="region_general-tab">
                    <span> {{ this.generalTabs[this.selectedTab - this.poiTabs.length].text }} </span>
                    <img v-for="img in this.generalTabs[this.selectedTab - this.poiTabs.length].images" :key="img" :src="imageUrl(img)">
                </div>
                <NewPoi v-if="isEditing && isPoiTab"
                    v-show="isCreatingPoi"
                    @close="cancelPoiCreation"
                    @confirm="poiCreated"
                    :type='this.poiTabs[selectedTab].type'
                    :error='creationError'
                />
            </div>
        </div>
    </div>
</template>

<script>
import NavigationBar from '../components/NavigationBar.vue'
import ImageSlider from '../components/ImageSlider.vue'
import Carte from '../components/Carte.vue'
import NewPoi from '../components/NewPoi.vue'
import { mapState } from 'vuex'

export default {
    name: "Region",
    components: {
        NavigationBar,
        ImageSlider,
        Carte,
        NewPoi
    },
    data() {
        return {
            name: "", 
            description: "",
            images: [],
            selectedTab: 0,
            poiTabs: [], 
            generalTabs: [],
            isEditing: false,
            isCreatingPoi: false,
            creationError: ""
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
            return (this.$route.fullPath + "/" + url).split("//").join("/");
        },
        getCategoryName(type) {
            return this.categoryNames[type]
        },
        imageUrl(localUrl) {
            return this.imagesLocation + localUrl
        },
        toggleEdit() {
            this.isEditing = !this.isEditing;
        },
        createPoi() {
            this.isCreatingPoi = true;
        },
        cancelPoiCreation() {
            this.isCreatingPoi = false;
        },
        poiCreated(name) {
            this.creationError = ""
            if(name.length === 0)
                this.creationError = "Un nom doit être fourni";
            else {
                try {
                    this.isCreatingPoi = false;
                    const id = name.split(' ').join('-').toLowerCase();
                    const requestOptions = {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name: name, type: this.poiTabs[this.selectedTab].type }),
                    };
                    fetch(this.apiAddr + "create/" + this.$route.params.region + "/" + id, requestOptions)
                        .catch( (err) => {
                            this.creationError = err;
                        }).then(() => {
                            this.isCreatingPoi = false;
                            return this.$router.push((this.$route.fullPath + "/" + id + "?edit=1").split("//").join("/"));
                        });
                } catch (err) {
                    this.creationError = err;
                }   
            }
        },
        removePoi(id, index) {
            this.$confirm("Êtes-vous sûr de vouloir supprimer cette carte ?").then( () => {
                const requestOptions = {
                    method: "DELETE"
                };
                fetch(this.apiAddr + "delete/" + this.$route.params.region + "/" + id, requestOptions);
                this.poiTabs[this.selectedTab].pois.splice(index, 1);
            });
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
                if('activities' in data) {
                    this.poiTabs.push({
                        type: "activity",
                        pois: data.activities
                    })
                }
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

.edit_button {
    width: 30px;
    height: 30px;
    cursor: pointer;
    opacity: 40%;
}

.edit_button:hover {
    opacity: 100%;
}

.edit_button_active {
    opacity: 100%;
}

.region_newpoi {
    width: 290px;
    margin: 20px;
    height: 290px;
    border: solid 5px;
    opacity: 60%;
    fill: white;
    display: flex;
    justify-content: center;
    cursor: pointer;
}

.region_newpoi svg {
    width: 30%;
}

.region_newpoi:hover {
    opacity: 100%;
}

.cross_close {
    position: absolute; 
    top: 25px; 
    right: 25px; 
    color: red; 
    cursor: pointer;
    font-weight: bold;
}

</style>