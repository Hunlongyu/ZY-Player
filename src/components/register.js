import Vue from 'vue'
import Frame from './Frame'
import Aside from './Aside'
import Film from './Film'
import IPTV from './IPTV'
// import Play from './Play'
// import Star from './Star'
// import Setting from './Setting'
// import Detail from './Detail'
// import Share from './Share'
// import History from './History'
// import EditSites from './EditSites'

export default {
  registerComponents () {
    Vue.component('Frame', Frame)
    Vue.component('Aside', Aside)
    Vue.component('Film', Film)
    Vue.component('IPTV', IPTV)
    // Vue.component('Play', Play)
    // Vue.component('Star', Star)
    // Vue.component('Setting', Setting)
    // Vue.component('Detail', Detail)
    // Vue.component('Share', Share)
    // Vue.component('History', History)
    // Vue.component('EditSites', EditSites)
  }
}
