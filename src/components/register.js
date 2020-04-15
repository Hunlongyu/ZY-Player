import Vue from 'vue'
import Aside from './Aside'
import Detail from './Detail'
import Film from './Film'
import Frame from './Frame'
import Play from './Play'
import Setting from './Setting'
import Share from './Share'
import Star from './Star'

export default {
  registerComponents () {
    Vue.component('Aside', Aside)
    Vue.component('Detail', Detail)
    Vue.component('Film', Film)
    Vue.component('Frame', Frame)
    Vue.component('Play', Play)
    Vue.component('Setting', Setting)
    Vue.component('Share', Share)
    Vue.component('Star', Star)
  }
}
