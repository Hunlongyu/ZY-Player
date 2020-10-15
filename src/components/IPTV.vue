<template>
  <div class="zy-iptv">
    <div class="box">
      <div class="body">body</div>
      <div class="footer">footer</div>
    </div>
    <div class="box"></div>
  </div>
</template>
<script>
export default {
  name: 'IPTV'
}
</script>
<style lang="scss" scoped>
.zy-iptv{
  flex: 1;
  margin: 0 10px 20px 0;
  border-radius: 6px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  .body{
    flex: 1;
    border: 1px solid #000;
  }
  .footer{
    height: 50px;
    border: 1px solid #000;
  }
}
</style>
