<template>
    <div class=region>
        <NavigationBar :name="name" @login-change="changeLogin"/>
        <ImageSlider :images="images" :altText="name" :isEditing="isEditing" :imageName="this.$route.params.region" @images-changed="updateImages" />

        <div style="display: flex; align-items: center; justify-content: space-between;">
            <div/>
            <h1 v-if="!isEditing"> {{ name }} </h1>
            <input v-else v-model="name">
            <img v-if="isEditing" src="images/edit_active.png" class="edit_button edit_button_active" @click="finishEdit">
            <img v-else-if="!isEditing && loggedIn" src="images/edit.png" class="edit_button" @click="beginEdit">
            <div v-else />
        </div>

        <p v-if="!isEditing" class="region_description"> {{ description}} </p>
        <textarea v-else v-model="description"/>

        <div class="region_flexbox">
            <div class="region_tabs">
                <div v-if="isEditing || poiTabs.activity.length > 0" class="region_onetab" :style="tabStyle('activity')" @click="changeTab('activity')"> Activités </div>
                <div v-if="isEditing || poiTabs.restaurant.length > 0" class="region_onetab" :style="tabStyle('restaurant')" @click="changeTab('restaurant')"> Restaurants </div>
                <div v-if="isEditing || poiTabs.hotel.length > 0" class="region_onetab" :style="tabStyle('hotel')" @click="changeTab('hotel')"> Hôtels </div>
                    
                <div v-for="(tab, index) in generalTabs" :key="tab.title" class="region_onetab" :style="tabStyle(index)" @click="changeTab(index)">
                    {{ tab.title }}
                </div>
            </div>
            <div class="region_tab-content" :style="tabStyle(selectedTab)">
                <div v-if="isPoiTab" class="region_tab-content-flex">
                    <div v-for="(poi, idx) in poiTabs[selectedTab]" :key="poi.name" style="position: relative;">
                        <Carte :nextUrl="nextUrl(poi.nextUrl)"
                            :address="poi.address"
                            :image="imageUrl(poi.image)"
                            :rate="poi.rate"
                            :name="poi.name"
                            :type="selectedTab" />
                        <div v-if="isEditing" class="cross_close" @click="removePoi(poi.nextUrl, idx)"> X </div>
                    </div>
                    <div v-if="isEditing" class="region_newpoi" @click="createPoi">
                        <svg viewBox="0 0 512 512">
                            <path stroke-width="3" d="M256,0C114.833,0,0,114.833,0,256s114.833,256,256,256s256-114.853,256-256S397.167,0,256,0z M256,472.341 c-119.275,0-216.341-97.046-216.341-216.341S136.725,39.659,256,39.659S472.341,136.705,472.341,256S375.295,472.341,256,472.341z" />
                            <path stroke-width="3" d="M355.148,234.386H275.83v-79.318c0-10.946-8.864-19.83-19.83-19.83s-19.83,8.884-19.83,19.83v79.318h-79.318 c-10.966,0-19.83,8.884-19.83,19.83s8.864,19.83,19.83,19.83h79.318v79.318c0,10.946,8.864,19.83,19.83,19.83 s19.83-8.884,19.83-19.83v-79.318h79.318c10.966,0,19.83-8.884,19.83-19.83S366.114,234.386,355.148,234.386z" />
                        </svg>
                    </div>
                </div>
                <div v-else-if="this.selectedTab === null" class="region_general-tab"/>
                <div v-else class="region_general-tab">
                    <span> {{ this.generalTabs[this.selectedTab].text }} </span>
                    <img v-for="img in this.generalTabs[this.selectedTab].images" :key="img" :src="imageUrl(img)">
                </div>
                <NewPoi v-if="isEditing && isPoiTab"
                    v-show="isCreatingPoi"
                    @close="cancelPoiCreation"
                    @confirm="poiCreated"
                    :type="selectedTab"
                    :error="creationError"
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
import Parse from 'parse'

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
            selectedTab: null,
            poiTabs: {activity: [],
                      hotel: [],
                      restaurant: []}, 
            generalTabs: [],
            isEditing: false,
            isCreatingPoi: false,
            creationError: "",
            loggedIn: Parse.User.current() != undefined,
        }
    },
    async created() {
        this.loadData()
    },
    watch: {
        '$route': 'loadData'
    },
    computed: {
        ...mapState(['colors', 'categoryNames']),
        isPoiTab() {
            return typeof this.selectedTab === "string";
        }
    },
    methods: {
        tabStyle(id) {
            if(id != this.selectedTab)
                return "background-color: darkgrey"
            if(this.isPoiTab)
                return "background-color: " + this.colors[id]
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
        imageUrl(image) {
            if(image === undefined)
                return "images/undefined"
            return image.url();
        },
        beginEdit() {
            this.isEditing = true;
        },
        async finishEdit() {
            this.isEditing = false;
            const params = {
                region: this.$route.params.region,
                data: {
                    name: this.name,
                    generalTabs: this.generalTabs,
                    images: this.images,
                    description: this.description
                }
            }
            Parse.Cloud.run("updateRegion", params).then( ( answer ) => {
                if(answer === undefined || answer.code >= 500) {
                    this.$alert("Error while trying to contact server... Please try again or contact an admin");
                    return;
                } else if(answer.code === 403) {
                    this.$alert("User unauthorized, please log in");
                    return;
                } else if(answer.code === 404)
                    return this.$router.push('/404');
                else if(answer.code !== 200) {
                    this.$alert("Unknown error: code " + answer.code);
                    return;
                }
            });
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
                this.creationError = "";
                const id = name.split(' ').join('-').toLowerCase();
                Parse.Cloud.run("createPoi", {
                        region: this.$route.params.region,
                        poi: id,
                        name: name,
                        type: this.selectedTab
                    }).then( ( answer ) => {
                    if(answer === undefined || answer.code >= 500) {
                        this.creationError = ("Error while trying to contact server... Please try again or contact an admin");
                        return;
                    } else if(answer.code === 403) {
                        this.creationError = ("User unauthorized, please log in");
                        return;
                    } else if(answer.code === 404)
                        return this.$router.push('/404');
                    else if(answer.code !== 200) {
                        this.creationError = ("Unknown error: code " + answer.code);
                        return;
                    }
                    this.isCreatingPoi = false;
                    return this.$router.push((this.$route.fullPath + "/" + id + "?edit=1").split("//").join("/"));
                });   
            }
        },
        removePoi(id, index) {
            this.$confirm("Êtes-vous sûr de vouloir supprimer cette carte ?").then( () => {
                const params = {
                    region: this.$route.params.region,
                    poi: id,
                };

                Parse.Cloud.run("deletePoi", params).then((answer) => {
                    if(answer === undefined || answer.code >= 500) {
                        this.$alert("Error while trying to contact server... Please try again or contact an admin");
                        return;
                    } else if(answer.code === 403) {
                        this.$alert("User unauthorized, please log in");
                        return;
                    } else if(answer.code === 404)
                        return this.$router.push('/404');
                    else if(answer.code !== 200) {
                        this.$alert("Unknown error: code " + answer.code);
                        return;
                    }
                    this.poiTabs[this.selectedTab].splice(index, 1);
                });
            });
        },
        async loadData() {
            Parse.Cloud.run("getRegion", {region: this.$route.params.region}).then( ( answer ) => {
                if(answer === undefined || answer.code >= 500) {
                    this.$alert("Error while trying to contact server... Please try again or contact an admin");
                    return;
                } else if(answer.code === 403) {
                    this.$alert("User unauthorized, please log in");
                    return;
                } else if(answer.code === 404)
                    return this.$router.push('/404');
                else if(answer.code !== 200) {
                    this.$alert("Unknown error: code " + answer.code);
                    return;
                }
                                    
                const data = answer.response;
                this.name = data.name;
                this.description = data.description;
                this.images = data.images;
                this.generalTabs = data.generalTabs; 
                if(this.generalTabs.length > 0)
                    this.selectedTab = 0;
                if('hotels' in data) {
                    this.poiTabs.hotel = data.hotels;
                    this.selectedTab = "hotel";
                }
                if('restaurants' in data) {
                    this.poiTabs.restaurant = data.restaurants;
                    this.selectedTab = "restaurant";
                }
                if('activities' in data) {
                    this.poiTabs.activity = data.activities;
                    this.selectedTab = "activity";
                }
            });
        },
        changeLogin(newValue) {
            this.loggedIn = newValue;
        },
        updateImages(img) {
            this.images = img;
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
    opacity: 0.4;
}

.edit_button:hover {
    opacity: 1;
}

.edit_button_active {
    opacity: 1;
}

.region_newpoi {
    width: 290px;
    margin: 20px;
    height: 290px;
    border: solid 5px;
    opacity: 0.6;
    fill: white;
    display: flex;
    justify-content: center;
    cursor: pointer;
}

.region_newpoi svg {
    width: 30%;
}

.region_newpoi:hover {
    opacity: 1;
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