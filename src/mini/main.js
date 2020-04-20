import Vue from 'vue'
import Mini from './Mini'
Vue.config.productionTip = false

new Vue({
  render: h => h(Mini)
}).$mount('#app')
