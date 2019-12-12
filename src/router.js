import Vue from 'vue'
import Router from 'vue-router'
import Search from './views/Search.vue'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'search',
      component: Search
    },
    {
      path: '/detail',
      name: 'detail',
      component: () => import(/* webpackChunkName: "about" */ './views/Detail.vue')
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
