import Vue from 'vue'
import Vuex from 'vuex'
import setting from '@/plugin/nedb/setting'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    site: 0,
    theme: {
      id: '',
      color: 'light'
    },
    iconActive: 'search',
    video: {}
  },
  getters: {
    getSite: state => {
      return state.site
    },
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
    SET_SITE: (state, payload) => {
      state.site = payload
    },
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
    changeSite: ({ commit }, payload) => {
      setting.update(payload.id, { site: payload.site }).then(res => {
        commit('SET_SITE', payload)
      })
    }
  }
})
