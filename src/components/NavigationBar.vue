<template>
    <div class=navigation>
        <div class="flexbox">
            <div> 
                <span v-if="!isWorld"> <router-link to="/">Monde</router-link> > </span> <span v-else>Monde</span>
                <router-link v-if="hasParent" :to="parent.url">{{ parent.name }}</router-link> <span v-if="hasParent"> > </span> 
                {{ name }} 
            </div>
            <div class=logo>
                <img src="images/logo.png">
            </div>
            <div> 
                <span v-if="loggedIn" @click="logout"> Logout </span>
                <span v-else @click="showDialog"> Login </span>
            </div>
        </div>
        <LoginDialog v-show="isLoggingIn"
                        @close="cancel"
                        @confirm="login"
        />
    </div>
</template>

<script>
import Parse from 'parse'
import LoginDialog from './LoginDialog.vue'
import { defineComponent } from 'vue';

export default defineComponent({
    name: "NavigationBar",
    components: {
        LoginDialog
    },
    props: {
        parent: Object,
        name: String
    },
    data() { return {
        loggedIn: Parse.User.current() != undefined,
        isLoggingIn: false
    }},
    computed: {
        hasParent() {
            return this.parent != null
        },
        isWorld() {
            return this.name == null
        }
    },
    methods: {
        async logout() {
            Parse.User.logOut().then( () => {
                this.$alert("Vous êtes déconnecté");
                this.loggedIn = false;
                this.$emit("login-change", this.loggedIn);
            }, err => {
                this.$alert('Erreur lors de la déconnexion : ', err);
            });
        },
        async login(loginInfo) {
            Parse.User.logIn(loginInfo.username, loginInfo.password).then(() => {
                this.isLoggingIn = false;
                this.$alert('Connecté !');
                this.loggedIn = true;
                this.$emit("login-change", this.loggedIn);
            }).catch( (error) => {
                this.$alert("Erreur lors de la connexion : " + error.message);
            });
        }, 
        cancel() {
            this.isLoggingIn = false;
        },
        showDialog() {
            this.isLoggingIn = true;
        }
    }
})
</script>

<style lang="scss">
.navigation {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 50px;
    background-color: rgb(48, 48, 48);
    color: white;
}

.flexbox {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: calc(100% - 10px);
    margin: 5px;
}

.flexbox div {
    width: 33%;
    margin-left: 10px;
    margin-right: 10px;
}

.flexbox div:first-of-type {
    text-align: left;
}

.flexbox div:last-of-type {
    text-align: right;
}

.navigation a {
    color: white;
    text-decoration: underline;
}

.navigation span {
    cursor: pointer;
}

.logo {
    height: 80%;
    position: relative;
}

.logo img {
    position: absolute;
    max-height: 100%;
    max-width: 100%;
    height: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}


</style>