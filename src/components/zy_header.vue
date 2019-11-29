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
  -webkit-app-region: drag;
  -webkit-user-select: none;
  display: flex;
  justify-content: space-between;
  .left,.right{
    display: flex;
    align-items: center;
    height: 50px;
    width: 50%;
    i{
      font-size: 20px;
      width:50px;
      height:50px;
      line-height:50px;
      cursor: pointer;
      -webkit-app-region: no-drag;
    }
  }
  .right{
    justify-content: flex-end;
  }
}
</style>
