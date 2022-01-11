<template>
<div>
    <div v-show="isLoading" class="image_loader">
        <div class="lds-ring">
            <div style="animation-delay: -0.45s;"></div>
            <div style="animation-delay: -0.3s;"></div>
            <div style="animation-delay: -0.15s;"></div>
            <div/>
        </div>
    </div>
    <div class="image-slider">
        <img class="image-slider_image"
            :src="imageUrl"
            :alt="altText" >
        <img class="fading-button right-arrow" src="images/right-red.png" alt="Next image" @click="incrementValue(1)">
        <img class="fading-button left-arrow" src="images/left-red.png" alt="Previous image" @click="incrementValue(-1)">
        <input type="file" id="file" ref="file" accept="image/*" multiple class="hidden_input" @change="handleFileUpload" />
        <label v-if="isEditing" for="file" class="fading-button file_button"> 
            <svg viewBox="0 0 512 512">
                <path d="M257,0C116.39,0,0,114.39,0,255s116.39,257,257,257s255-116.39,255-257S397.61,0,257,0z M392,285H287v107 c0,16.54-13.47,30-30,30c-16.54,0-30-13.46-30-30V285H120c-16.54,0-30-13.46-30-30c0-16.54,13.46-30,30-30h107V120 c0-16.54,13.46-30,30-30c16.53,0,30,13.46,30,30v105h105c16.53,0,30,13.46,30,30S408.53,285,392,285z" />
            </svg>
        </label>
        <div v-if="isEditing" class="fading-button remove_button" @click="removeImage">
            <svg viewBox="0 0 512 512" transform="rotate(45)">
                <path d="M257,0C116.39,0,0,114.39,0,255s116.39,257,257,257s255-116.39,255-257S397.61,0,257,0z M392,285H287v107 c0,16.54-13.47,30-30,30c-16.54,0-30-13.46-30-30V285H120c-16.54,0-30-13.46-30-30c0-16.54,13.46-30,30-30h107V120 c0-16.54,13.46-30,30-30c16.53,0,30,13.46,30,30v105h105c16.53,0,30,13.46,30,30S408.53,285,392,285z" />
            </svg>
        </div>
        <div v-if="isEditing" class="fading-button front_button" @click="setFront">
            <svg viewBox="0 0 405 405" :style="frontButtonStyle">
                <path d="M202.531,0C90.676,0,0,90.678,0,202.535C0,314.393,90.676,405.07,202.531,405.07c111.859,0,202.539-90.678,202.539-202.535 C405.07,90.678,314.391,0,202.531,0z M243.192,312.198c0,8.284-6.716,15-15,15h-27.629c-8.284,0-15-6.716-15-15v-168.35 l-17.1,9.231c-4.069,2.197-8.924,2.393-13.155,0.536c-4.233-1.858-7.373-5.565-8.51-10.046l-5.459-21.518 c-1.695-6.683,1.383-13.66,7.461-16.913l47.626-25.491c2.177-1.166,4.608-1.775,7.078-1.775h24.688c8.284,0,15,6.716,15,15V312.198 z" />
            </svg>
        </div> 
    </div>
</div>
</template>

<script>
import mixin from '../mixins/imgur.ts'

export default {
    name: "ImageSlider",
    mixins: [mixin],
    data() {
        return {
            currentImage: 0,
            timer: '',
            isLoading: false
        }
    },
    props: {
        images: Array,
        altText: String,
        isEditing: Boolean,
        imageName: String
    },
    watch: {
        isEditing: function (val) {
            if(!val)
                this.timer = setInterval(this.incrementValue, 4000);
            else
                clearInterval(this.timer);
        }
    },
    created() {
        if(!this.isEditing)
            this.timer = setInterval(this.incrementValue, 4000);
    },
    computed: {
        imageUrl() {
            return this.getImageUrl(this.images[this.currentImage]);
        },
        frontButtonStyle() {
            if(this.currentImage == 0)
                return "fill: rgb(84, 165, 241);"
            return "";
        }
    },
    methods: {
        incrementValue(nb=1) {
            this.currentImage += nb;
            this.currentImage %= this.images.length;
            if(this.currentImage < 0)
                this.currentImage += this.images.length;
            clearInterval(this.timer);
            if(!this.isEditing)
                this.timer = setInterval(this.incrementValue, 4000);
        },
        async handleFileUpload() {
            if(this.$refs.file.files.length > 0) {
                this.isLoading = true;
                const promises = Array.from(this.$refs.file.files).map(this.upload);
                Promise.all(promises).then((new_images_urls) => {
                    const total = new_images_urls.length;
                    new_images_urls = new_images_urls.filter(url => url); // Remove images that failed
                    const new_total = new_images_urls.length;
                    if(new_total < total)
                        this.$alert("Certaines images n'ont pas été téléchargées correctement", "Erreur de téléchargement", "warning");
                    if(new_total > 0) {
                        this.images.push(...new_images_urls);
                        this.$emit("images-changed", this.images);
                        this.currentImage = this.images.length - 1;
                    }
                    this.isLoading = false;
                }).catch( (error) => {
                    this.$alert("Blop");
                });
            }
        },
        removeImage() {
            this.$confirm("Êtes-vous sûr de vouloir supprimer cette image ?").then( () => {
                if(this.images.length > 0)
                    this.images.splice(this.currentImage, 1);
                this.currentImage %= this.images.length;
                this.$emit("images-changed", this.images);
            });
        },
        setFront() {
            if(this.images.length > 0) {
                const tmp = this.images[this.currentImage];
                this.images.splice(this.currentImage, 1);
                this.images.unshift(tmp);
                this.currentImage = 0;
                this.$emit("images-changed", this.images);
            }
        }
    },
    beforeDestroy() {
        clearInterval(this.timer)
    }
}
</script>

<style lang="scss">
.image-slider {
  display: flex;
  width: 100vw;
  justify-content: space-between;
  padding-top: 10px;
  padding-bottom: 20px;
  margin-left: calc((100% - 100vw)/2);
}

.image-slider_image {
  max-width: 100vw;
  width: 100vw;
  height: 400px;
  object-fit: cover;
  float: center;
}

.fading-button {
    cursor: pointer;
    opacity: 0.6;
}

.fading-button:hover {
    opacity: 1;
}

.fading-button svg {
    width: 40px;
    fill: rgb(177, 177, 177);
}

.right-arrow {
    max-width: 50px;
    position: absolute;
    top: 195px;
    left: calc(100vw - 60px);
}

.left-arrow {
    max-width: 50px;
    position: absolute;
    top: 195px;
    left: 0;
}

.hidden_input {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
}

.file_button {
    position: absolute;
    right: 60px;
    top: 75px;
}

.remove_button {
    position: absolute;
    right: 10px;
    top: 75px;
}

.front_button {
    position: absolute;
    right: 110px;
    top: 75px;
}

.image_loader {
    background-color: black;
    width: 100vw;
    height: 400px;
    right: 0;
    top: 56px;
    opacity: .6;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
}

.lds-ring {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
}
.lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;

    width: 80%;
    height: 80%;

    margin: 10%;
    border: 8px solid #fff;
    border-radius: 50%;
    animation-name: lds-ring;
    animation-timing-function: cubic-bezier(0.5, 0, 0.5, 1);
    animation-iteration-count: infinite;

    border-width: 8px;
    border-color: rgb(84, 165, 241) transparent transparent;
    animation-duration: 1.2s;
}
@keyframes lds-ring {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>