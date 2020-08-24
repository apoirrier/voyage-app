<template>
<div class="list_region">
    <router-link v-for="region in regions" :key="region.url" :to="'/world/' + region.url"> {{ region.name }} </router-link>
    <button @click="createRegion"> Ajouter une région </button>
</div>
</template>

<script>
import Parse from 'parse'

export default {
    name: "Home",
    data() {
        return {
            regions: []
        }
    },
    async created() {
        this.loadData();
    },
    watch: {
        '$route': 'loadData'
    },
    methods: {
        loadData() {
            Parse.Cloud.run("listRegion").then( (answer) => {
                if(answer === undefined || answer.code >= 500) {
                    this.$alert("Error while trying to contact server... Please try again or contact an admin");
                    return;
                } else if(answer.code !== 200) {
                    this.$alert("Unknown error: code " + answer.code);
                    return;
                }
                this.regions = answer.regions;
            });
        },
        async createRegion() {
            this.$prompt("Nouvelle région").then( (name) => {
                if(name === undefined || name === "")
                    return;
                Parse.Cloud.run("createRegion", {name: name}).then( (answer) => {
                    if(answer === undefined || answer.code >= 500) {
                        this.$alert("Error while trying to contact server... Please try again or contact an admin");
                        return;
                    } else if(answer.code === 403) {
                        this.$alert("User unauthorized, please log in");
                        return;
                    } else if(answer.code === 400) {
                        this.$alert("Error creating region: " + answer.error);
                        return;
                    }
                    else if(answer.code !== 200) {
                        this.$alert("Unknown error: code " + answer.code);
                        return;
                    }
                    this.loadData();
                });
            });
        }
    }
}
</script>

<style lang="scss">
.list_region {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.list_region button {
    width: fit-content;
    margin: 10px;
}
</style>