<template>
    <div class="notfound"> 
        <h2> Erreur 404 </h2>
        <h1> La page que vous cherchez est probablement un mirage </h1>
        <div>
            <img src="/images/dupon_bd1.gif">
        </div>
        <router-link to="/"> Home </router-link>
    </div>
</template>

<script>
export default {
    name: "PageDoesNotExist"
}
</script>

<style lang="scss">
.notfound {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.notfound div {
    height: 75%;
}

.notfound img {
    height: auto;
    width: 100%;
}
</style>