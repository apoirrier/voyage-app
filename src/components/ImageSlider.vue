<template>
    <div class="image-slider">
        <img class="image-slider_image"
            :src="imageUrl"
            :alt="altText" >
    </div>
</template>

<script>
export default {
    name: "ImageSlider",
    data() {
        return {
            currentImage: 0,
            images: ["schauenstein_ext.jpeg", "Schauenstein_int.webp"],
            altText: "Schauenstein Schloss"
        }
    },
    computed: {
        imageUrl() {
            return "images/" + this.images[this.currentImage];
        }
    }
}
</script>

<style lang="scss">
.image-slider {
  display: flex;
  width: 110%;
  justify-content: space-between;
  padding-top: 20px;
  padding-bottom: 20px;
  margin-left: -20px;
}

.image-slider_image {
  max-width: 110%;
  width: 110%;
  height: 300px;
  object-fit: cover;
}
</style>