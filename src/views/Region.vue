<template>
    <router-link :to="nextUrl"> Schauenstein Schloss </router-link>
</template>

<script>
export default {
    name: "Region",
    computed: {
        nextUrl() {
            return this.$route.fullPath + "/schauenstein"
        }
    }
}
</script>