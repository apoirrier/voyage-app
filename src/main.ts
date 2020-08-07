import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import rate from 'vue-rate'
import 'vue-rate/dist/vue-rate.css'

Vue.config.productionTip = false
Vue.use(rate)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
