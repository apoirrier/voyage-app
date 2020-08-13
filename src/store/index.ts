import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apiAddr: "http://localhost:5001/voyages-pppc/us-central1/app/api/",
    imagesLocation: "images/",
    colors: {
      'restaurant': '#bb3131',
      'hotel': '#23395d',
      'activity': '50c878',
      'general': '#fcf4a3'
    },
    categoryNames: {
      'restaurant': 'Restaurants',
      'hotel': 'Hôtels',
      'activity': "Activités"
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
