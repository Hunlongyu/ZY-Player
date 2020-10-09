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
    editSites: {
      show: false,
      sites: []
    }
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
    getEditSites: state => {
      return state.editSites
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
    SET_EDITSITES: (state, payload) => {
      state.editSites = payload
    }
  }
})
