<template>
    <div>
        <img v-if="!hasLoaded" src="images/teleport.jpg" style="height: 80%; width: 100%">
        <div v-else class=region>
            <NavigationBar :name="name" @login-change="changeLogin"/>
            <ImageSlider :images="images" :altText="name" :isEditing="isEditing" :imageName="this.$route.params.region" @images-changed="updateImages" />

            <div style="display: flex; align-items: center; justify-content: space-between;">
                <div/>
                <h1 v-if="!isEditing"> {{ name }} </h1>
                <input v-else class="h1input" v-model="name">
                <img v-if="isEditing" src="images/edit_active.png" class="edit_button edit_button_active" @click="finishEdit">
                <img v-else-if="!isEditing && loggedIn" src="images/edit.png" class="edit_button" @click="beginEdit">
                <div v-else />
            </div>

            <EditableMarkdown v-if="!isEditing" class="region_description" :inputData="this.description" />
            <textarea v-else class="pinput" v-model="description"/>

            <div class="region_flexbox">
                <div class="region_tabs">
                    <div v-if="isEditing || poiTabs.activity.length > 0" class="region_onetab" :style="tabStyle('activity')" @click="changeTab('activity')"> Activités </div>
                    <div v-if="isEditing || poiTabs.restaurant.length > 0" class="region_onetab" :style="tabStyle('restaurant')" @click="changeTab('restaurant')"> Restaurants </div>
                    <div v-if="isEditing || poiTabs.hotel.length > 0" class="region_onetab" :style="tabStyle('hotel')" @click="changeTab('hotel')"> Hôtels </div>
                        
                    <div v-for="(tab, index) in generalTabs" :key="index" class="region_onetab" :style="tabStyle(index)" @click="changeTab(index)">
                        <span v-if="!isEditing || index != selectedTab"> {{ tab.title }} </span>
                        <div v-else style="display: flex;justify-content: space-between;">
                            <input style="width: 60px;" v-model="tab.title">
                            <span class="cross_close_comment" @click="removeTab">
                                <svg viewBox="0 0 365.71733 365">
                                    <path d="m356.339844 296.347656-286.613282-286.613281c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503906-12.5 32.769532 0 45.25l286.613281 286.613282c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082032c12.523438-12.480468 12.523438-32.75.019532-45.25zm0 0" />
                                    <path d="m295.988281 9.734375-286.613281 286.613281c-12.5 12.5-12.5 32.769532 0 45.25l15.082031 15.082032c12.503907 12.5 32.769531 12.5 45.25 0l286.632813-286.59375c12.503906-12.5 12.503906-32.765626 0-45.246094l-15.082032-15.082032c-12.5-12.523437-32.765624-12.523437-45.269531-.023437zm0 0" />
                                </svg>
                            </span>
                        </div>
                    </div>
                    <div v-if="isEditing" class="region_onetab" :style="tabStyle(-1)" style="width: 3%;" @click="newGeneralTab"> + </div>
                </div>
                <div class="region_tab-content" :style="tabStyle(selectedTab)">
                    <div v-if="isPoiTab" class="region_tab-content-flex">
                        <div v-for="(poi, idx) in currentPoiTab" :key="poi.name" style="position: relative;">
                            <Carte :nextUrl="nextUrl(poi.nextUrl)"
                                :address="poi.address"
                                :image="getImageUrl(poi.image)"
                                :rate="poi.rate"
                                :name="poi.name"
                                :type="selectedTab" />
                            <div v-if="isEditing" class="cross_close" @click="removePoi(poi.nextUrl, idx)">
                                <svg viewBox="0 0 365.71733 365">
                                    <path d="m356.339844 296.347656-286.613282-286.613281c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503906-12.5 32.769532 0 45.25l286.613281 286.613282c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082032c12.523438-12.480468 12.523438-32.75.019532-45.25zm0 0" />
                                    <path d="m295.988281 9.734375-286.613281 286.613281c-12.5 12.5-12.5 32.769532 0 45.25l15.082031 15.082032c12.503907 12.5 32.769531 12.5 45.25 0l286.632813-286.59375c12.503906-12.5 12.503906-32.765626 0-45.246094l-15.082032-15.082032c-12.5-12.523437-32.765624-12.523437-45.269531-.023437zm0 0" />
                                </svg>
                            </div>
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
                        <EditableMarkdown v-if="!isEditing" style="align-self: flex-start;" :inputData="generalTabs[selectedTab].text" />
                        <textarea v-else class="pinput" v-model="generalTabs[selectedTab].text"/>
                        <div v-if="isEditing">
                            <hr>
                            <span> Clique sur une image pour copier son adresse : </span>
                            <vue-horizontal responsive>
                                <section v-for="(img, idx) in this.generalTabs[this.selectedTab].images" :key="getImageUrl(img)" style="position: relative;">
                                    <img :src="getImageUrl(img)" class="imageSlider" @click="copy(img)" title="Copy to clipboard">
                                    <div class="cross_close" style="right: 10px;" @click="removeImage(idx)">
                                        <svg viewBox="0 0 365.71733 365">
                                            <path d="m356.339844 296.347656-286.613282-286.613281c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503906-12.5 32.769532 0 45.25l286.613281 286.613282c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082032c12.523438-12.480468 12.523438-32.75.019532-45.25zm0 0" />
                                            <path d="m295.988281 9.734375-286.613281 286.613281c-12.5 12.5-12.5 32.769532 0 45.25l15.082031 15.082032c12.503907 12.5 32.769531 12.5 45.25 0l286.632813-286.59375c12.503906-12.5 12.503906-32.765626 0-45.246094l-15.082032-15.082032c-12.5-12.523437-32.765624-12.523437-45.269531-.023437zm0 0" />
                                        </svg>
                                    </div>
                                </section>
                                <section style="display: flex; align-items: center; justify-content: center;">
                                    <input type="file" id="tab_image" ref="tab_image" accept="image/*" class="hidden_input" @change="handleFileUpload" />
                                    <label for="tab_image" class="fading-button">
                                        <svg viewBox="0 0 512 512">
                                            <path d="M257,0C116.39,0,0,114.39,0,255s116.39,257,257,257s255-116.39,255-257S397.61,0,257,0z M392,285H287v107 c0,16.54-13.47,30-30,30c-16.54,0-30-13.46-30-30V285H120c-16.54,0-30-13.46-30-30c0-16.54,13.46-30,30-30h107V120 c0-16.54,13.46-30,30-30c16.53,0,30,13.46,30,30v105h105c16.53,0,30,13.46,30,30S408.53,285,392,285z" />
                                        </svg>
                                    </label>
                                </section>
                            </vue-horizontal>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import NavigationBar from '../components/NavigationBar.vue'
import ImageSlider from '../components/ImageSlider.vue'
import Carte from '../components/Carte.vue'
import EditableMarkdown from '../components/EditableMarkdown.vue'
import { mapState } from 'vuex'
import Parse from 'parse'
import VueHorizontal from 'vue-horizontal';
import imgur from "../mixins/imgur.ts"
import parse from "../mixins/parse.ts"

export default {
    name: "Region",
    mixins: [imgur, parse],
    components: {
        NavigationBar,
        ImageSlider,
        Carte,
        EditableMarkdown,
        VueHorizontal
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
            creationError: "",
            loggedIn: Parse.User.current() != undefined,
            hasLoaded: false
        }
    },
    async created() {
        this.loadData()
    },
    watch: {
        '$route': 'loadData'
    },
    async beforeRouteLeave(to, from, next) {
        if(this.isEditing) {
            try {
              const isOk = await this.$confirm("Sauvegarder ?");
              if(isOk)
                await this.finishEdit();
            } finally {
              next();
            }
        } else
            next();
    },
    computed: {
        ...mapState(['colors', 'categoryNames']),
        isPoiTab() {
            return typeof this.selectedTab === "string";
        },
        createPoiTitle() {
            if(this.selectedTab == "restaurant")
                return "Nouveau restaurant";
            if(this.selectedTab == "hotel")
                return "Nouvel hôtel";
            if(this.selectedTab == "activity")
                return "Nouvelle activité";
            return "";
        },
        currentPoiTab() {
            return this.poiTabs[this.selectedTab].sort(function (a, b) {
                        if(a.rate === undefined)
                            return 1;
                        if(b.rate === undefined)
                            return -1;
                        return b.rate - a.rate;
                    });
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
            this.selectedTab = id;
            let lastTab = localStorage.lastTab ? JSON.parse(localStorage.lastTab) : {};
            lastTab[this.$route.params.region] = id;
            localStorage.lastTab = JSON.stringify(lastTab);
        },
        nextUrl(url) {
            return (this.$route.fullPath + "/" + url).split("//").join("/");
        },
        getCategoryName(type) {
            return this.categoryNames[type]
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
            this.callParse("updateRegion", params, () => {}, this);
        },
        createPoi() {
            this.$prompt(this.createPoiTitle).then( (name) => {
                this.creationError = ""
                if(name.length === 0)
                    this.creationError = "Un nom doit être fourni";
                else {
                    this.creationError = "";
                    const id = name.replace(/[^\w\- ]/g, '').toLowerCase().replace(/ /g, "-");
                    this.callParse("createPoi",
                                    {
                                        region: this.$route.params.region,
                                        poi: id,
                                        name: name,
                                        type: this.selectedTab
                                    },
                                    () => {
                                        this.isCreatingPoi = false;
                                        this.$confirm("Editer la nouvelle page ?").then((isOk) => {
                                            if(isOk) {
                                                this.finishEdit().then(() => {
                                                    this.$router.push(("/world/" + this.$route.params.region + "/" + id + "?edit=1").split("//").join("/"));
                                                });
                                            }
                                        }).catch(() => {
                                            this.poiTabs[this.selectedTab].push({
                                                address: "",
                                                name: name,
                                                nextUrl: id
                                            });
                                        });
                                    },
                                    this
                    ); 
                }
            });
        },
        removePoi(id, index) {
            this.$confirm("Êtes-vous sûr de vouloir supprimer cette carte ?").then( () => {
                const params = {
                    region: this.$route.params.region,
                    poi: id,
                };

                this.callParse("deletePoi", params, () => {this.poiTabs[this.selectedTab].splice(index, 1);}, this);
            });
        },
        async loadData() {
            this.callParse("getRegion", {region: this.$route.params.region}, (answer) => {
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
                if(this.$route.query.edit == 1)
                    this.isEditing = true;
                if(localStorage.lastTab && Object.keys(JSON.parse(localStorage.lastTab)).includes(this.$route.params.region))
                    this.selectedTab = JSON.parse(localStorage.lastTab)[this.$route.params.region];
                this.hasLoaded = true;
            }, this);
        },
        changeLogin(newValue) {
            this.loggedIn = newValue;
        },
        updateImages(img) {
            this.images = img;
        },
        removeTab() {
            this.$confirm("Êtes-vous sûr de vouloir supprimer cet onglet ?").then( () => {
                this.generalTabs.splice(this.selectedTab, 1);
                if(this.generalTabs.length === 0)
                    this.selectedTab = "hotel";
                else if(this.selectedTab == this.generalTabs.length)
                    this.selectedTab--;
            });
        },
        async handleFileUpload() {
            if(this.$refs.tab_image.files.length > 0 && this.$refs.tab_image.files[0] !== undefined) {
                this.upload(this.$refs.tab_image.files[0]).then((img_url) => {
                    this.generalTabs[this.selectedTab].images.push(img_url);
                });
            }
        },
        removeImage(idx) {
            this.generalTabs[this.selectedTab].images.splice(idx, 1);
        },
        newGeneralTab() {
            this.$prompt("Nouvel onglet").then( (title) => {
                if(title.length !== 0) {
                    this.generalTabs.push({
                        title: title,
                        text: "",
                        images: []
                    });
                    this.selectedTab = this.generalTabs.length - 1;
                }
            });
        },
        copy(img) {
            this.$copyText("![](" + this.getImageUrl(img) + ")");
            this.$fire({
                text: "Copié dans le presse-papier!",
                timer: 1000,
                showConfirmButton: false,
                position: 'bottom-end',
                backdrop: false,
                width: '200px'
            })
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
    color: #fefefe;
    border-radius: 10px 10px 0 0;
    cursor: pointer;
    text-align: center;
    width: 100px;
    height: 30px;
    line-height: 30px;
    vertical-align: middle;
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
    align-items: center;
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
    cursor: pointer;
    fill: red;
    display: flex;
}

.cross_close svg {
    width: 15px;
    height: 15px;
}

.h1input {
    display: block;
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
    text-align: center;
    border-width: 0;
}

.pinput {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: justify;
    width: -webkit-fill-available;
    min-height: 200px;
    font-size: 1em;
    border-width: 0;
}

.imageSlider {
    height: 200px;
    object-fit: cover;
    cursor: pointer;
}

.imageSlider:hover {
    opacity:0.6;
}

</style>