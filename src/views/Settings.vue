<template>
  <Row class="setting">
    <div class="item about">
      <div class="title">关于:</div>
      <ul>
        <li>作者: <a href="https://github.com/Hunlongyu">Hunlongyu</a></li>
        <li>官网: <a href="https://zy_player.hunlongyu.fun">ZY Player</a></li>
        <li>反馈: <a href="https://github.com/Hunlongyu/ZY-Player/issues">Issues</a></li>
      </ul>
    </div>
    <div class="item upgrade">
      <div class="title">更新:</div>
      <div class="btns">版本: v0.5.9</div>
      <div class="btns"><Button @click="checkUpgrade">检查更新</Button></div>
    </div>
    <div class="item theme">
      <div class="title">主题:</div>
      <div class="btns">
        <Button @click="changeTheme({ id: getTheme.id, color: 'light' })">light</Button>
        <Button @click="changeTheme({ id: getTheme.id, color: 'dark' })">Dark</Button>
      </div>
    </div>
  </Row>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'settings',
  computed: {
    ...mapGetters([
      'getTheme'
    ])
  },
  methods: {
    ...mapActions([
      'changeTheme'
    ]),
    checkUpgrade () {}
  }
}
</script>
<style lang="scss" scoped>
.setting{
  padding: 10px;
  .item{
    margin-bottom: 10px;
    .title{
      font-size: 16px;
    }
    ul{
      margin-left: 10px;
      list-style: none;
    }
    .btns{
      margin-left: 10px;
      button{
        margin-right: 10px;
      }
    }
  }
}
</style>
