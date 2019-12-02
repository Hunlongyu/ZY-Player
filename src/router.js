import Vue from 'vue'
import Router from 'vue-router'
import List from './views/List.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'list',
      component: List
    },
    {
      path: '/search',
      name: 'search',
      component: () => import(/* webpackChunkName: "about" */ './views/Search.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import(/* webpackChunkName: "about" */ './views/Settings.vue')
    },
    {
      path: '/play',
      name: 'play',
      component: () => import(/* webpackChunkName: "about" */ './views/Player.vue')
    },
    {
      path: '/collection',
      name: 'collection',
      component: () => import(/* webpackChunkName: "about" */ './views/Collection.vue')
    }
  ]
})
