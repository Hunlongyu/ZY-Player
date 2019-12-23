<template>
  <Row class="sider-box">
    <div class="top">
      <Icon title="搜索" :class="iconActive === 'search' ? 'active': ''" type="md-search" @click="iconClickEvent('search')"/>
      <Icon title="详情" v-show="Object.keys(video).length !== 0" :class="iconActive === 'detail' ? 'active': ''" type="md-list" @click="iconClickEvent('detail')"/>
      <Icon title="播放" v-show="Object.keys(video).length !== 0" :class="iconActive === 'play' ? 'active': ''" type="md-play" @click="iconClickEvent('play')"/>
      <Icon title="收藏" :class="iconActive === 'collection' ? 'active': ''" type="md-star" @click="iconClickEvent('collection')"/>
    </div>
    <div class="bottom">
      <Icon title="设置" :class="iconActive === 'settings' ? 'active': ''" type="md-settings" @click="iconClickEvent('settings')"/>
    </div>
  </Row>
</template>
<script>
export default {
  name: 'zy-sider',
  computed: {
    iconActive () {
      return this.$store.getters.getIconActive
    },
    video () {
      return this.$store.getters.getVideo
    }
  },
  methods: {
    iconClickEvent (e) {
      this.$router.push({ name: e })
      this.$store.commit('SET_ICON_ACTIVE', e)
    }
  }
}
</script>
<style lang="scss" scoped>
.sider-box{
  height: 100%;
  position: relative;
  -webkit-app-region: drag;
  -webkit-user-select: none;
  .bottom{
    position: absolute;
    bottom: 0;
  }
  i{
    -webkit-app-region: no-drag;
    font-size: 32px;
    width: 70px;
    height: 70px;
    line-height: 70px;
    cursor: pointer;
  }
}
</style>
