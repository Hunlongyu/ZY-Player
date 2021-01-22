import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    view: 'Film',
    setting: {
      theme: 'light',
      site: 'zuidazy',
      view: 'picture',
      shortcut: true
    },
    detail: {
      show: false,
      key: '',
      info: {}
    },
    share: {
      show: false,
      key: '',
      info: {}
    },
    video: {
      key: '',
      info: {}
    },
    appState: {
      windowIsOnTop: false
    },
    DetailCache: {}
  },
  getters: {
    getView: state => {
      return state.view
    },
    getSetting: state => {
      return state.setting
    },
    getDetail: state => {
      return state.detail
    },
    getShare: state => {
      return state.share
    },
    getVideo: state => {
      return state.video
    },
    getAppState: state => {
      return state.appState
    },
    getDetailCache: state => {
      return state.DetailCache
    }
  },
  mutations: {
    SET_VIEW: (state, payload) => {
      state.view = payload
    },
    SET_SETTING: (state, payload) => {
      state.setting = payload
    },
    SET_DETAIL: (state, payload) => {
      state.detail = payload
    },
    SET_SHARE: (state, payload) => {
      state.share = payload
    },
    SET_VIDEO: (state, payload) => {
      state.video = payload
    },
    SET_APPSTATE: (state, payload) => {
      state.appState = payload
    },
    set_DetailCache: (state, payload) => {
      state.DetailCache = payload
    }
  }
})
