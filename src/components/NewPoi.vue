<script>
  export default {
    name: 'NewPoi',
    methods: {
      close() {
        this.$emit('close');
      },
      confirm() {
          this.$emit('confirm', this.name);
      }
    },
    props: {
        type: String,
        error: String
    },
    computed: {
        title() {
            if(this.type == "restaurant")
                return "Nouveau restaurant";
            if(this.type == "hotel")
                return "Nouvel hôtel";
            if(this.type == "activity")
                return "Nouvelle activité";
            return "";
        }
    },
    data() {
        return {
            name: ""
        }
    }
  };
</script>

<template>
    <transition name="modal-fade">
        <div class="modal-backdrop">
            <div class="modal">
                <h2> {{ title }} </h2>
                <span> Nom : 
                    <input v-model="name">
                </span>
                <span> {{ error }} </span>
                <div class="modal_buttons">
                    <button @click="close"> Annuler </button>
                    <button @click="confirm"> Valider </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    background: #FFFFFF;
    display: flex;
    flex-direction: column;
    color: #2c3e50;
    padding: 10px;
    width: 250px;
    height: 150px;
    align-items: center;
  }

  .modal h2 {
      width: 100%;
  }

  .modal_buttons {
      display: flex;
      align-items: flex-end;
      padding-top: 20px;
      padding-bottom: 20px;
      align-self: flex-end;
  }
  .modal_buttons button{
      margin: 5px;
  }

</style>