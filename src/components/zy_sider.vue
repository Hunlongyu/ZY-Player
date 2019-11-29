<template>
  <Row class="sider-box">
    <div class="top">
      <Icon class="active" type="md-list" />
      <Icon type="md-search" />
      <Icon type="md-play" />
      <Icon type="md-star" />
    </div>
    <div class="bottom">
      <Icon type="md-settings" />
    </div>
  </Row>
</template>
<script>
export default {
  name: 'zy-sider'
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
