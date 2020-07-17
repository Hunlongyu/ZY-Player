import Vue from 'vue'
import Aside from './Aside'
import Frame from './Frame'
import Film from './Film'
import Play from './Play'
import Star from './Star'
import Setting from './Setting'
import Detail from './Detail'
import Share from './Share'

export default {
  registerComponents () {
    Vue.component('Aside', Aside)
    Vue.component('Frame', Frame)
    Vue.component('Film', Film)
    Vue.component('Play', Play)
    Vue.component('Star', Star)
    Vue.component('Setting', Setting)
    Vue.component('Detail', Detail)
    Vue.component('Share', Share)
  }
}
