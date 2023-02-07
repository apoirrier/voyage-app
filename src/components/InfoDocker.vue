<template>
    <div class="docker-content-default" :style="styleColor">
        <h2> Informations pratiques </h2>

        <a class="infodocker_item" :href="_website" v-if="hasWebsite && !isEditing" style="color: #e7e7e7;"> 
             <img class=infodocker_icon src="/images/www.png"> {{ host }}
        </a>
        <div v-else-if="isEditing">
            <img class=infodocker_icon src="/images/www.png">
            <input type="url" v-model="_website" @change="onChange">
        </div>

        <a class="infodocker_item" :href="mailto" v-if="hasMail && !isEditing" style="color: #e7e7e7;"> 
             <img class=infodocker_icon src="/images/at.png"> {{ _mail }}
        </a>
        <div v-else-if="isEditing">
            <img class=infodocker_icon src="/images/at.png">
            <input type="email" v-model="_mail" @change="onChange">
        </div>

        <div class="infodocker_item" v-if="hasPhone && !isEditing">
            <img class=infodocker_icon src="/images/phone.png"> {{ _phone }}
        </div>
        <div v-else-if="isEditing">
            <img class=infodocker_icon src="/images/phone.png">
            <input type="tel" v-model="_phone" @change="onChange">
        </div>

        <div class="infodocker_item" v-if="hasAddress && !isEditing">
            <img class=infodocker_icon src="/images/address.png"> {{ _address }}
        </div>
        <div v-else-if="isEditing">
            <img class=infodocker_icon src="/images/address.png">
            <input v-model="_address" @change="onChange">
        </div>

        <div class="googlemap" v-if="!isEditing">
            <iframe
            :src="_iframeUrl"
            width="400"
            height="300"
            frameborder="0"
            style="border:0;"
            allowfullscreen
            aria-hidden="false"
            tabindex="0"
            ></iframe>
        </div>
        <div v-else>
            Minimap: 
            <input type="url" v-model="_iframeUrl" @change="onChange">
        </div>
        <p/>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { defineComponent } from 'vue';

export default defineComponent({
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
        },
        iframeUrl: {
            type: String,
            required: true
        },
        isEditing: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            _website: this.website,
            _phone: this.phone,
            _address: this.address,
            _mail: this.mail,
            _iframeUrl: this.iframeUrl
        }
    },
    computed: {
        hasWebsite() {
            return this._website.length != 0
        },
        hasPhone() {
            return this._phone.length != 0
        },
        hasAddress() {
            return this._address.length != 0
        },
        hasMail() {
            return this._mail.length != 0
        },
        mailto() {
            return "mailto:" + this._mail
        },
        host() {
            if(!this.hasWebsite)
                return "";
            if(!this._website.includes("//")) {
                if(!this._website.includes("/"))
                    return this._website;
                return this._website.split("/")[0];
            }
            if(!this._website.split("//")[1].includes("/"))
                return this._website.split("//")[1];
            return this._website.split("//")[1].split("/")[0];
        },
        ...mapState(['colors']),
        styleColor() {
            return "background-color: " + this.colors[this.type]
        }
    },
    methods: {
        onChange() {
            const data = {
                website: this._website,
                phone: this._phone,
                address: this._address,
                mail: this._mail,
                iframeUrl: this._iframeUrl
            }
            this.$emit("hasChanged", data);
        }
    }
})
</script>

<style lang="scss">

.docker-content-default {
    width: 100%;
    display: flex;
    flex-direction: column;
    color: #e7e7e7;
    position: sticky;
    top: 20px;
    height: fit-content;
    margin-top: 20px;
}

.infodocker_icon {
    max-width: 18px;
    display: inline-block;
    vertical-align: middle;
    padding-right: 10px;
}

.infodocker_item {
    margin-bottom: 10px;
    align-self: flex-start;
    padding-left: 5%;
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