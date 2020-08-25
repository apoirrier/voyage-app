import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    colors: {
      'restaurant': '#bb3131',
      'hotel': '#1167b1',
      'activity': '#00561b',
      'general': '#fedc56'
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
