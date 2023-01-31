import { createStore } from 'vuex'

const store = createStore({
  state: {
    colors: {
      'restaurant': '#bb3131',
      'hotel': '#1167b1',
      'activity': '#00561b',
      'general': '#ffa500'
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

export default store;
