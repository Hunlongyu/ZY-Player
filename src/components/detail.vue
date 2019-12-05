<template>
  <div class="detail">{{ video }}</div>
</template>
<script>
export default {
  name: 'detail',
  computed: {
    video () {
      return this.$store.getters.getVideo
    }
  }
}
</script>
<style lang="scss" scoped>
.detail{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: #fff;
}
</style>
