import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Mini from '../views/Mini.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/mini',
    name: 'Mini',
    component: Mini
  }
]

const router = new VueRouter({
  routes
})

export default router
