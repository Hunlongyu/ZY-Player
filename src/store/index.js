import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    view: 'Play',
    theme: 'light',
    site: 'zuidazy',
    language: 'zhCn',
    detail: {
      show: false,
      v: {}
    },
    share: {
      show: false,
      v: {}
    },
    video: {}
  },
  getters: {
    getView: state => {
      return state.view
    },
    getTheme: state => {
      return state.theme
    },
    getSite: state => {
      return state.site
    },
    getLanguage: state => {
      return state.language
    },
    getDetail: state => {
      return state.detail
    },
    getVideo: state => {
      return state.video
    },
    getShare: state => {
      return state.share
    }
  },
  mutations: {
    SET_VIEW: (state, payload) => {
      state.view = payload
    },
    SET_THEME: (state, payload) => {
      state.theme = payload
    },
    SET_SITE: (state, payload) => {
      state.site = payload
    },
    SET_LANGUAGE: (state, payload) => {
      state.language = payload
    },
    SET_DETAIL: (state, payload) => {
      state.detail = payload
    },
    SET_VIDEO: (state, payload) => {
      state.video = payload
    },
    SET_SHARE: (state, payload) => {
      state.share = payload
    }
  }
})
