<template>
    <div class=navigation>
        <div> 
            <span v-if="!isWorld"> <router-link to="/"> Monde </router-link> > </span> <span v-else> Monde </span>
            <router-link v-if="hasParent" :to="parent.url"> {{ parent.name }} </router-link> <span v-if="hasParent"> > </span> 
            {{ name }} 
        </div>
        <div> 
            <span v-if="loggedIn" @click="logout"> Logout </span>
            <span v-else @click="showDialog"> Login </span>
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

export default {
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
                this.$alert("Logged out successfully");
                this.loggedIn = false;
                this.$emit("login-change", this.loggedIn);
            }, err => {
                this.$alert('Error signing out', err);
            });
        },
        async login(loginInfo) {
            Parse.User.logIn(loginInfo.username, loginInfo.password).then(() => {
                this.isLoggingIn = false;
                this.$alert('Logged in successfully');
                this.loggedIn = true;
                this.$emit("login-change", this.loggedIn);
            }).catch( (error) => {
                this.$alert("Error signing in: " + error.message);
            });
        }, 
        cancel() {
            this.isLoggingIn = false;
        },
        showDialog() {
            this.isLoggingIn = true;
        }
    }
}
</script>

<style lang="scss">
.navigation {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.navigation span {
    cursor: pointer;
}
</style>