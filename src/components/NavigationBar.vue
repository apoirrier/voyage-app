<template>
    <div class>
        <div class=navigation> <router-link v-if="hasParent" :to="parent.url"> {{ parent.name }} </router-link> <span v-if="hasParent"> > </span> {{ name }} </div>
        <div class=backMap> <router-link to="/"> Retour à la carte </router-link></div>
    </div>
</template>

<script>
export default {
    name: "NavigationBar",
    props: {
        parent: Object,
        name: {
            type: String,
            required: true
        },
    },
    computed: {
        hasParent() {
            return this.parent != null
        }
    }
}
</script>

<style lang="scss">
.navigation {
    justify-content: left;
    float: left;
    font-size: 15px;
    color: #111111;
}

.backMap {
    justify-content: right;
    float: right;
    font-size: 15px;
    color: #111111;
}
</style>