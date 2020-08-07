<template>
<div>
    <div class="image-slider">
        <img class="image-slider_image"
            :src="imageUrl"
            :alt="altText" >
        <img class="right-arrow" src="images/right-red.png" alt="Next image" @click="incrementValue(1)">
        <img class="left-arrow" src="images/left-red.png" alt="Previous image" @click="incrementValue(-1)">
    </div>
</div>
</template>

<script>
export default {
    name: "ImageSlider",
    data() {
        return {
            currentImage: 0,
            timer: ''
        }
    },
    props: {
        images: Array,
        altText: String
    },
    created() {
        this.timer = setInterval(this.incrementValue, 4000)
    },
    computed: {
        imageUrl() {
            return "images/" + this.images[this.currentImage];
        }
    },
    methods: {
        incrementValue(nb=1) {
            this.currentImage += nb
            this.currentImage %= this.images.length
            clearInterval(this.timer)
            this.timer = setInterval(this.incrementValue, 4000)
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
  padding-top: 20px;
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

</style>