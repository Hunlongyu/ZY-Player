<template>
  <div class="home">
    <Aside />
    <div class="body">
      <Frame />
      <Film v-show="view === 'Film'" />
      <Play v-show="view === 'Play'" />
      <Star v-show="view === 'Star'" />
      <Setting v-show="view === 'Setting'" />
    </div>
    <transition name="slide">
      <Detail v-if="detail.show"/>
    </transition>
    <transition name="slide">
      <Share v-if="share.show"/>
    </transition>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  data () {
    return {
      view: 'Film',
      detail: {
        show: false
      },
      share: {
        show: false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.home{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
