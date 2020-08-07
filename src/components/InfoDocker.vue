<template>
    <div :class="styleColor">
        <h2> Informations pratiques </h2>
        <a :href="website" v-if="hasWebsite" style="color: #e7e7e7;"> 
             <img class=icon src="images/www.png"> {{ website }}
        </a>
        <a :href="mailto" v-if="hasMail" style="color: #e7e7e7;"> 
             <img class=icon src="images/at.png"> {{ mail }}
        </a>
        <div v-if="hasPhone">
            <img class=icon src="images/phone.png"> {{ phone }}
        </div>
        <div v-if="hasAddress">
            <img class=icon src="images/address.png"> {{ address }}
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
            default: ''
        },
        phone: {
            type: String,
            default: ''
        },
        mail: {
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
        hasAddress() {
            return this.address.length != 0
        },
        hasMail() {
            return this.mail.length != 0
        },
        mailto() {
            return "mailto:" + this.mail
        },
        styleColor() {
            if(this.type == "restaurant")
                return "docker-content-default docker-content-red"
            return "docker-content-default"
        }
    }
}
</script>

<style lang="scss">
.docker-content-red {
    background-color: #bb3131;
}

.docker-content-default {
    float: right;
    width: 35%;
    display: flex;
    flex-direction: column;
    color: #e7e7e7;
}

.icon {
    max-width: 18px;
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
    margin-top: 20px;
    left:5%;
    top:0;
    height:100%;
    width:90%;
    position:absolute;
}
</style>