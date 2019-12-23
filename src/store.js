import Vue from 'vue'
import Vuex from 'vuex'
import setting from '@/plugin/nedb/setting'
import video from '@/plugin/nedb/video'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    theme: {
      id: '',
      color: 'light'
    },
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
    changeTheme: ({ commit }, payload) => {
      setting.update(payload.id, { theme: payload.color }).then(res => {
        commit('SET_THEME', payload)
      })
    },
    saveVideo: ({ commit }, payload) => {
      video.add(payload).then(res => {
        console.log(res)
      })
    }
  }
})
