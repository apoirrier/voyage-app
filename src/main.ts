import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import rate from 'vue-rate'
import 'vue-rate/dist/vue-rate.css'
import VueSimpleAlert from "vue-simple-alert";
import Parse from 'parse'

Vue.config.productionTip = false
Vue.use(rate);
Vue.use(VueSimpleAlert);
Vue.use(Parse);

Parse.initialize("2PH1n445TRPy4YjynvkmfKqlTkEnb9dNl1MTvbpt","vFZmdYwnHSxS1H5emXeAKu18ilN55ZHbYGkRxwgM");
Parse.serverURL = 'https://parseapi.back4app.com/'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
