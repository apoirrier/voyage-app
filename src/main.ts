import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import rate from 'vue-rate'
import 'vue-rate/dist/vue-rate.css'
import VueSimpleAlert from "vue-simple-alert";

Vue.config.productionTip = false
Vue.use(rate)
Vue.use(VueSimpleAlert);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
