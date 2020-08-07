<template>
    <div>
        <div class=navigation> <router-link :to="parent.url"> {{ parent.name }} </router-link> > <router-link :to="url"> {{ name }} </router-link> </div>
        <div class=backMap> <router-link to="/"> Retour à la carte </router-link></div>
    </div>
</template>

<script>
export default {
    name: "PoI",
    data() {
        return {
            parent: {
                name: "Suisse",
                url: "/schweiss"
            },
            name: "Schauenstein Schloss",
            localUrl: "/schauenstein"
        }
    },
    computed: {
        url() {
            return this.parent.url + this.localUrl
        }
    }
}
</script>

<style lang="scss">
.navigation {
    justify-content: left;
    float: left;
    font-size: 10px;
    color: #111111;
}

.backMap {
    justify-content: right;
    float: right;
    font-size: 10px;
    color: #111111;
}
</style>