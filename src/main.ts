import Vue from 'vue'
import App from './App.vue'
import store from './store'
import './plugins/element.ts'
import Register from './page/register'

Vue.config.productionTip = false

Register.registerComponents()

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
