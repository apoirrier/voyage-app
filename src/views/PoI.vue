<template>
    <div class>
        <NavigationBar :name="name" :parent="parent" :localUrl="localUrl"/>
        <ImageSlider/>
    </div>
</template>

<script>
import ImageSlider from '../components/ImageSlider.vue'
import NavigationBar from '../components/NavigationBar.vue'

export default {
    name: "PoI",
    components: {
        ImageSlider,
        NavigationBar
    },
    data() {
        return {
            parent: {
                name: "Suisse",
                url: "/schweiss"
            },
            name: "Schauenstein Schloss",
            localUrl: "/schauenstein"
        }
    }
}
</script>
