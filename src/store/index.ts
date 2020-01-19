import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Main: 'Player',
    site: 0,
    detail: {
      show: false,
      video: ''
    },
    dUrl: '',
    video: {}
  },
  getters: {
    getMain: state => {
      return state.Main
    },
    getSite: state => {
      return state.site
    },
    getDetail: state => {
      return state.detail
    },
    getVideo: state => {
      return state.video
    }
  },
  mutations: {
    SET_MAIN: (state, payload) => {
      state.Main = payload
    },
    SET_SITE: (state, payload) => {
      state.site = payload
    },
    SET_DETAIL: (state, payload) => {
      state.detail = payload
    },
    SET_VIDEO: (state, payload) => {
      state.video = payload
    }
  },
  actions: {},
  modules: {}
})
