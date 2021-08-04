<script>
  export default {
    name: 'LoginDialog',
    methods: {
      close() {
        this.$emit('close');
      },
      confirm() {
          this.$emit('confirm', {username: this.username, password: this.password});
      }
    },
    data() {
        return {
            username: "",
            password: ""
        }
    }
  };
</script>

<template>
    <div class="logindialog">
        <div class="logindialog_popup" tabindex="-1">
            <div class="swal2-header">
                <h2 class="swal2-title" id="swal2-title" style="display: flex;">Connexion</h2>
            </div>
            <div class="swal2-content">
                <div style="display: block;">Nom d'utilisateur</div>
                <input class="swal2-input" type="text" style="display: flex;" v-model="username">
                <div style="display: block;">Mot de passe</div>
                <input class="swal2-input" type="password" style="display: flex;" v-model="password">
            </div>
            <div class="swal2-actions">
                <button type="button" class="swal2-confirm swal2-styled" style="display: inline-block; border-left-color: rgb(48, 133, 214); border-right-color: rgb(48, 133, 214);" @click="confirm">OK</button>
                <button type="button" class="swal2-cancel swal2-styled" style="display: inline-block;" @click="close">Annuler</button>
            </div>
        </div>
    </div>
</template>

<style>
.logindialog {
    overflow-y: auto;
    background-color: rgba(0,0,0,.4);
    align-items: center;
    display: flex;
    position: fixed;
    z-index: 1060;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    flex-direction: row;
    justify-content: center;
    padding: .625em;
    overflow-x: hidden;
    transition: background-color .1s;
}

.logindialog_popup {
    display: flex;
    margin: auto;
    animation: swal2-show .3s;
    box-sizing: border-box;
    flex-direction: column;
    justify-content: center;
    width: 32em;
    max-width: 100%;
    padding: 1.25em;
    border: none;
    border-radius: .3125em;
    background: white;
}

</style>