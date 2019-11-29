<template>
  <Row class="header-box">
    <div class="left">
      <Icon type="md-return-left" />
    </div>
    <div class="right">
      <Icon type="md-remove" />
      <Icon type="md-add" />
      <Icon type="md-close" />
    </div>
  </Row>
</template>
<script>
export default {
  name: 'zy_header'
}
</script>
<style lang="scss" scoped>
.header-box{
  height: 100%;
  border: 1px solid #000;
  -webkit-app-region: drag;
  -webkit-user-select: none;
  .left,.right{
    display: inline-block;
    height: 35px;
    i{
      -webkit-app-region: no-drag;
      font-size: 20px;
      width:35px;
      height:35px;
      line-height:35px;
      cursor: pointer;
      background-color: #aaa;
    }
  }
  .left{
    top: 0;
    left: 0;
  }
  .right{
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
