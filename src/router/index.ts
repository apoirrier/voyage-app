import { createRouter, createWebHistory } from 'vue-router'
import PoI from '../views/PoI.vue'
import Home from '../views/Home.vue'
import Region from '../views/Region.vue'
import PageDoesNotExist from '../views/PageDoesNotExist.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
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
      path: '/:catchAll(.*)',
      redirect: '/404'
    }
  ]
});

export default router;
