<template>
    <router-link :to="nextUrl" class="carte">
        <img class="carte_img" :src="image">
        <h2 class="carte_txt" style="margin: 7px; "> {{ name }} </h2>
        <span class="carte_txt" style="margin-left: 10px; margin-right: 10px;"> {{ shortAddress }} </span>
        <Rating :score="rate" :type="type" />
    </router-link>
</template>

<script>
import Rating from "./Rating.vue"

export default {
    name: "Carte",
    components: {
        Rating
    },
    props: {
        nextUrl: String,
        image: String,
        name: String,
        address: String,
        rate: Number,
        type: String,
    },
    computed: {
        shortAddress () {
            const allInfos = this.address.split(",");
            return allInfos[allInfos.length - 1];
        }
    }
}
</script>

<style>
.carte {
    display: flex;
    flex-direction: column;
    background-color: white;
    color: #2c3e50;
    width: 300px;
    margin: 20px;
    height: 300px;
}

.carte_img {
    width: 100%;
    height: 65%;
    object-fit: cover;
}

.carte_txt {
    align-self: flex-start;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 95%;
}
</style>