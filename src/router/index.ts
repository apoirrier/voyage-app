import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import PoI from '../views/PoI.vue'
import Home from '../views/Home.vue'
import Region from '../views/Region.vue'
import PageDoesNotExist from '../views/PageDoesNotExist.vue'

Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/world/:region',
    component: Region
  },
  {
    path: '/world/:region/:poi',
    component: PoI
  },
  {
    path: '/404',
    component: PageDoesNotExist
  },
  {
    path: '*',
    redirect: '/404'
  }
]

const router = new VueRouter({
  routes
})

export default router
