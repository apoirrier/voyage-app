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
    <transition name="modal-fade">
        <div class="modal-backdrop">
            <div class="modal">
                <h2> Login </h2>
                <span> Username : 
                    <input v-model="username">
                </span>
                <span> Mot de passe : 
                    <input type="password" v-model="password">
                </span>
                <div class="modal_buttons">
                    <button @click="close"> Annuler </button>
                    <button @click="confirm"> Connexion </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<style>


</style>