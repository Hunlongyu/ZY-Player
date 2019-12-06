import Vue from 'vue'
import Vuex from 'vuex'
import { setting } from '@/plugin/localforage/'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    theme: 'light',
    iconActive: 'search',
    video: {}
  },
  getters: {
    getTheme: state => {
      return state.theme
    },
    getIconActive: state => {
      return state.iconActive
    },
    getVideo: state => {
      return state.video
    }
  },
  mutations: {
    SET_THEME: (state, payload) => {
      state.theme = payload
    },
    SET_ICON_ACTIVE: (state, payload) => {
      state.iconActive = payload
    },
    SET_VIDEO: (state, payload) => {
      state.video = payload
    }
  },
  actions: {
    addCollection: (payload) => {
      localStorage.collection = payload
    },
    changeTheme: ({ commit }, payload) => {
      setting.set('theme', payload).then(e => {
        commit('SET_THEME', e)
      })
    }
  }
})
