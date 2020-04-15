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
export default {
  name: 'Home',
  computed: {
    view () {
      return this.$store.getters.getView
    },
    detail () {
      return this.$store.getters.getDetail
    },
    share () {
      return this.$store.getters.getShare
    }
  }
}
</script>
<style lang="scss" scoped>
.home{
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .body{
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    padding: 0 20px 20px;
  }
}
</style>
