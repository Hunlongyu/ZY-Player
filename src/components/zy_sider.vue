<template>
  <Row class="sider-box">
    <div class="top">
      <Icon :class="iconActive === 'search' ? 'active': ''" type="md-search" @click="iconClickEvent('search')"/>
      <Icon :class="iconActive === 'detail' ? 'active': ''" type="md-list" @click="iconClickEvent('detail')"/>
      <Icon :class="iconActive === 'play' ? 'active': ''" type="md-play" @click="iconClickEvent('play')"/>
      <Icon :class="iconActive === 'collection' ? 'active': ''" type="md-star" @click="iconClickEvent('collection')"/>
    </div>
    <div class="bottom">
      <Icon :class="iconActive === 'settings' ? 'active': ''" type="md-settings" @click="iconClickEvent('settings')"/>
    </div>
  </Row>
</template>
<script>
export default {
  name: 'zy-sider',
  computed: {
    iconActive () {
      return this.$store.getters.getIconActive
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
