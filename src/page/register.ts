import Vue from 'vue'
import Film from './film.vue'
import Search from './search.vue'
import Player from './player.vue'
import Star from './star.vue'
import Setting from './setting.vue'

export default {
  registerComponents () {
    Vue.component('Film', Film)
    Vue.component('Search', Search)
    Vue.component('Player', Player)
    Vue.component('Star', Star)
    Vue.component('Setting', Setting)
  }
}
