<template>
  <div class="zy-aside">
    <span :class="view === 'Film' ? 'active' : ''" title="电影" @click="changeView('Film')">
      <IconFilm class="icon icon-film" />
    </span>
    <span :class="view === 'IPTV' ? 'active' : ''" title="TV" @click="changeView('IPTV')">
      <IconTv class="icon icon-tv" />
    </span>
    <span :class="view === 'Play' ? 'active' : ''" title="播放" @click="changeView('Play')">
      <IconPlay class="icon icon-play" />
    </span>
    <span :class="view === 'Star' ? 'active' : ''" title="收藏" @click="changeView('Star')">
      <IconStar class="icon icon-star" />
    </span>
    <span :class="view === 'History' ? 'active' : ''" title="历史" @click="changeView('History')">
      <IconHistory class="icon icon-history" />
    </span>
    <span :class="view === 'Setting' ? 'active' : ''" title="设置" @click="changeView('Setting')">
      <IconSetting class="icon icon-setting" />
    </span>
  </div>
</template>
<script>
import IconFilm from '../assets/img/ikonate/aperture.svg'
import IconTv from '../assets/img/ikonate/tv.svg'
import IconPlay from '../assets/img/ikonate/play.svg'
import IconStar from '../assets/img/ikonate/favourite.svg'
import IconHistory from '../assets/img/ikonate/time.svg'
import IconSetting from '../assets/img/ikonate/settings.svg'
export default {
  name: 'Aside',
  components: {
    IconFilm,
    IconTv,
    IconPlay,
    IconStar,
    IconHistory,
    IconSetting
  },
  data () {
    return {
      view: 'Film'
    }
  },
  methods: {
    changeView (e) {
      this.view = e
    }
  }
}
</script>
<style lang="scss" scoped>
.zy-aside{
  width: 60px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  -webkit-app-region: drag;
  span{
    width: 100%;
    height: 60px;
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    -webkit-app-region: no-drag;
    &:hover, &.active{
      .icon{
        stroke-width: 2;
      }
    }
    .icon{
      width: 24px;
      height: auto;
    }
  }
}
</style>
