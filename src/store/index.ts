import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    colors: {
      'restaurant': '#bb3131',
      'hotel': '#23395d',
      'activity': '#00561b',
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
