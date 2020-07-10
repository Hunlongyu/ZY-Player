import Vue from 'vue'
import Mini from './Mini'
import 'modern-normalize'
import '../lib/element/index'

Vue.config.productionTip = false

new Vue({
  render: h => h(Mini)
}).$mount('#app')
