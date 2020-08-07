<template>
    <div :class="styleColor">
        <h2> Informations pratiques </h2>
        <a :href="website" v-if="hasWebsite"> 
             <img class=icon src="images/www.png"> Website
        </a>
        <p> {{ address }} </p>
        <div v-if="hasPhone">
            <img class=icon src="images/phone.png"> {{ phone }}
        </div>
        <div class="googlemap">
            <slot name="googlemap"></slot>
        </div>
        <p/>
    </div>
</template>

<script>
export default {
    name: "InfoDocker",
    props: {
        website: {
            type: String,
            default: ''
        },
        address: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            required: true
        }
    },
    computed: {
        hasWebsite() {
            return this.website.length != 0
        },
        hasPhone() {
            return this.phone.length != 0
        },
        styleColor() {
            if(this.type == "restaurant")
                return "docker-content-red"
            return "docker-content-default"
        }
    }
}
</script>

<style lang="scss">
.docker-content-red {
    background-color: #d87272;
    float: right;
    width: 35%;
}

.docker-content-default {
    background-color: #8d8d8d;
    float: right;
    width: 35%;
}

.icon {
    max-width: 30px;
    display: inline-block;
    vertical-align: middle;
    padding-bottom: 10px;
}

.googlemap {
    overflow:hidden;
    padding-bottom:60%;
    position:relative;
    height:0;
}

.googlemap iframe{
    left:5%;
    top:0;
    height:100%;
    width:90%;
    position:absolute;
}
</style>