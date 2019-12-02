import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    theme: 'light',
    iconActive: 'list'
  },
  getters: {
    getTheme: state => {
      return state.theme
    },
    getIconActive: state => {
      return state.iconActive
    }
  },
  mutations: {
    SET_THEME: (state, payload) => {
      state.theme = payload
    },
    SET_ICON_ACTIVE: (state, payload) => {
      state.iconActive = payload
    }
  },
  actions: {

  }
})
