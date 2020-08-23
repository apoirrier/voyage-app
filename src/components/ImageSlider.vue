<template>
<div>
    <div class="image-slider">
        <img class="image-slider_image"
            :src="imageUrl"
            :alt="altText" >
        <img class="right-arrow" src="images/right-red.png" alt="Next image" @click="incrementValue(1)">
        <img class="left-arrow" src="images/left-red.png" alt="Previous image" @click="incrementValue(-1)">
        <input type="file" id="file" ref="file" accept="image/*" class="hidden_input" @change="handleFileUpload" />
        <label v-if="isEditing" for="file" class="file_button"> 
            <svg viewBox="0 0 512 512">
                <path d="M257,0C116.39,0,0,114.39,0,255s116.39,257,257,257s255-116.39,255-257S397.61,0,257,0z M392,285H287v107 c0,16.54-13.47,30-30,30c-16.54,0-30-13.46-30-30V285H120c-16.54,0-30-13.46-30-30c0-16.54,13.46-30,30-30h107V120 c0-16.54,13.46-30,30-30c16.53,0,30,13.46,30,30v105h105c16.53,0,30,13.46,30,30S408.53,285,392,285z" />
            </svg>
        </label>
        <div v-if="isEditing" class="remove_button" @click="removeImage">
            <svg viewBox="0 0 512 512" transform="rotate(45)">
                <path d="M257,0C116.39,0,0,114.39,0,255s116.39,257,257,257s255-116.39,255-257S397.61,0,257,0z M392,285H287v107 c0,16.54-13.47,30-30,30c-16.54,0-30-13.46-30-30V285H120c-16.54,0-30-13.46-30-30c0-16.54,13.46-30,30-30h107V120 c0-16.54,13.46-30,30-30c16.53,0,30,13.46,30,30v105h105c16.53,0,30,13.46,30,30S408.53,285,392,285z" />
            </svg>
        </div>
    </div>
</div>
</template>

<script>
import Parse from 'parse';

export default {
    name: "ImageSlider",
    data() {
        return {
            currentImage: 0,
            timer: '',
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
            if(this.images[this.currentImage] === undefined)
                return "images/undefined"
            return this.images[this.currentImage].url();
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
            if(this.$refs.file.files.length > 0 && this.$refs.file.files[0] !== undefined) {
                const fullname = this.$refs.file.files[0].name.split(".");
                const extension = "." + fullname[fullname.length - 1];
                const fileToSave = new Parse.File(this.imageName + extension, this.$refs.file.files[0]);
                fileToSave.save().then(() => {
                    this.images.push(fileToSave);
                    this.$emit("images-changed", this.images);
                    this.currentImage = this.images.length - 1;
                }).catch( (error) => {
                    this.$alert(error);
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

.right-arrow {
    max-width: 50px;
    position: absolute;
    top: 195px;
    left: calc(100vw - 60px);
    cursor: pointer;
    opacity: 0.8;
}

.right-arrow:hover {
    max-width: 50px;
    position: absolute;
    top: 195px;
    left: calc(100vw - 60px);
    cursor: pointer;
    opacity: 1;
}

.left-arrow {
    max-width: 50px;
    position: absolute;
    top: 195px;
    left: 0;
    cursor: pointer;
    opacity: 0.8;
}

.left-arrow:hover {
    max-width: 50px;
    position: absolute;
    top: 195px;
    left: 0;
    cursor: pointer;
    opacity: 1;
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
    cursor: pointer;
    opacity: 60%;
    position: absolute;
    right: 60px;
    top: 75px;
}

.file_button:hover {
    opacity: 100%;
}

.file_button svg {
    width: 40px;
    fill: rgb(177, 177, 177);
}

.remove_button {
    cursor: pointer;
    opacity: 60%;
    position: absolute;
    right: 10px;
    top: 75px;
}

.remove_button:hover {
    opacity: 100%;
}

.remove_button svg {
    width: 40px;
    fill: rgb(177, 177, 177);
}
</style>