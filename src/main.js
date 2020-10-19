import Vue from 'vue'
import App from './App.vue'
import store from './store'
import 'modern-normalize'
import Register from './components/register'
import './lib/element/index'

Register.registerComponents()
Vue.config.productionTip = false
new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
