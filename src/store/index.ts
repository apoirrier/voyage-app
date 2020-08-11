import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apiAddr: "http://localhost:5001/voyages-pppc/us-central1/app/api/",
    colors: {
      'restaurant': '#bb3131',
      'hotel': '#23395d',
      'tips': '#d4a017'
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
