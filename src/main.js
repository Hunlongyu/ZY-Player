import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'modern-normalize'
import VueI18n from 'vue-i18n'
import { languages, defaultLocal } from './locales/index'
import './lib/element/index'

Vue.config.productionTip = false

Vue.use(VueI18n)
const messages = Object.assign(languages)
const i18n = new VueI18n({
  locale: defaultLocal,
  fallbackLocale: 'zhCn',
  messages
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
