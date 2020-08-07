<template>
    <div class>
        <NavigationBar :name="name" :parent="parent" :localUrl="localUrl"/>
        <ImageSlider/>
        <div class="main-content">
            <h1> {{ name }} </h1>
            <symbol id="icon-toque" class="icon" viewBox="0 0 64 64">
                <path stroke-width="2" d="m 51.991,8 h -8.01 C 41.153,4.243 36.728,2 32.009,2 27.283,2 22.862,4.244 20.046,8 H 12.008 C 5.392,8.001 0.01,13.383 0.01,20 c 0,6.279 4.85,11.438 11,11.949 V 57 c 0,2.757 2.243,5 5,5 h 31.98 c 0.004,0 0.006,-0.002 0.01,-0.002 0.004,0 0.006,0.002 0.01,0.002 0.002,0 0.003,-10e-4 0.005,-10e-4 V 62 c 2.743,-0.012 4.976,-2.26 4.976,-5.01 V 31.949 c 6.15,-0.511 11,-5.67 11,-11.949 C 63.99,13.383 58.608,8.001 51.991,8 Z M 13.01,57 h 37.979 c 0,4.983888 -37.979,4.993242 -37.979,0 z M 51.99,30 c -0.553,0 -1,0.447 -1,1 V 55 H 13.01 V 31 c 0,-0.553 -0.447,-1 -1,-1 -5.514,0 -10,-4.486 -10,-10 0,-5.514 4.486,-10 10,-10 h 6.748 c -1.142,2.148 -1.748,4.533 -1.748,7 0,0.553 0.447,1 1,1 0.553,0 1,-0.447 1,-1 0,-2.674 0.809,-5.241 2.342,-7.43 C 23.772,6.082 27.757,4 32.01,4 c 4.249,0 8.238,2.083 10.67,5.571 1.524,2.189 2.33,4.759 2.33,7.429 0,0.553 0.447,1 1,1 0.553,0 1,-0.447 1,-1 0,-2.464 -0.604,-4.85 -1.742,-7 h 6.723 c 5.514,0 10,4.486 10,10 0,5.514 -4.487,10 -10.001,10 z"></path>
                <path d="m32 26.997c-.553 0-1 .447-1 1v18.993c0 .553.447 1 1 1s1-.447 1-1v-18.993c0-.553-.447-1-1-1z"></path>
                <path d="m23 26.997c-.553 0-1 .447-1 1v18.993c0 .553.447 1 1 1s1-.447 1-1v-18.993c0-.553-.447-1-1-1z"></path>
                <path d="m41 26.997c-.553 0-1 .447-1 1v18.993c0 .553.447 1 1 1s1-.447 1-1v-18.993c0-.553-.447-1-1-1z"></path>
            </symbol>
            <rate class="RateCustom" :length="5" :value="currentRate" :disabled="true" :iconref="icon" />
            <p class=description-content> {{ description }} </p>
            <Comment v-for="comment in comments"
                    :title="comment.title"
                    :content="comment.content"
                    :date="comment.date"
                    :rate="comment.rate"
                    :icon="icon"
                    :key="comment"
            />
        </div>
        <InfoDocker :website="website" :address="address" :phone="phone" :type="type">
            <template v-slot:googlemap>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2735.2093755187334!2d9.443593815599991!3d46.72133167913591!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4784ea5b9284d799%3A0x3cb3ffee0874f99d!2sSchauenstein%20Castle!5e0!3m2!1sen!2sch!4v1596810390067!5m2!1sen!2sch" width="400" height="300" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>
            </template>
        </InfoDocker>
    </div>
</template>

<script>
import ImageSlider from '../components/ImageSlider.vue'
import NavigationBar from '../components/NavigationBar.vue'
import InfoDocker from '../components/InfoDocker.vue'
import Comment from '../components/Comment.vue'

export default {
    name: "PoI",
    components: {
        ImageSlider,
        NavigationBar,
        InfoDocker,
        Comment
    },
    data() {
        return {
            parent: {
                name: "Suisse",
                url: "/schweiss"
            },
            name: "Schauenstein Schloss",
            localUrl: "/schauenstein",
            description: "Restaurant triplement étoilé (en 2020), situé dans un authentique château Suisse. Il y a un grand et magnifique jardin. Le château est facilement accessible en transports publics (station de bus en face), et dispose d'un parking extérieur gratuit pour les visiteurs. Son chef, Andreas Caminada, régale les clients avec une cuisine moderne et expressive.",
            website: "https://schauenstein.ch/",
            address: "Schlossgass 77, 7414 Fürstenau",
            phone: "+41816321080",
            type: "restaurant",
            comments: [
                {
                    title: "Très bon mais pas digne de ce qu'on attend d'un 3*",
                    content: "Très bon restaurant, la cuisson des viandes et poissons parfaitement executée, et quelques plats surprenants. Le cadre est magnifique et on peut prendre l'apéro et le dessert dans le jardin. On peut même repartir avec le petit livret qui décrit le château, le menu, et quelques graines à planter dans le jardin. Cependant pas tant de surprises, les plats sont très modernes et complètement destructurés, et l'une des salle est dans la pénombre la plus totale. L'eau est payante et pas donnée. Les serveurs sont efficaces mais parlent peu anglais ou français, donc l'énoncé des plats pas toujours compréhensible.",
                    rate: 4,
                    date: "30 juillet 2020"
                }
            ]
        }
    },
    computed: {
        icon() {
            if(this.type == "restaurant")
                return "icon-toque"
            return ""
        },
        currentRate() {
            return this.comments[this.comments.length - 1].rate
        }
    }
}
</script>

<style lang="scss">
.main-content {
    max-width: 60%;
    float: left;
}

.RateCustom.Rate .icon {
width: 25px;
height: 25px;
}
.RateCustom.Rate .Rate__star.hover { color: red; }

.description-content {
    justify-content: left;
    text-align: justify;
}
</style>