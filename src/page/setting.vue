<template>
  <el-row class="setting">
    <el-row class="item about">
      <el-row class="title"><i class="el-icon-view"></i><span>关于</span></el-row>
      <el-row class="info">
        <ul>
          <li><el-link :underline="false" icon="el-icon-user" @click="linkOpen('https://github.com/Hunlongyu')">作者: Hunlongyu</el-link></li>
          <li><el-link :underline="false" icon="el-icon-discover" @click="linkOpen('https://zy_player.hunlongyu.fun')">官网: ZY Player</el-link></li>
          <li><el-link :underline="false" icon="el-icon-chat-line-round" @click="linkOpen('https://github.com/Hunlongyu/ZY-Player/issues')">反馈: Issues</el-link></li>
        </ul>
      </el-row>
    </el-row>
    <el-row class="item theme">
      <el-row class="title"><i class="el-icon-picture-outline-round"></i><span>主题</span></el-row>
      <el-row class="card-box">
        <el-card shadow="hover" class="card">
          <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
          <span size="mini">Light</span>
        </el-card>
        <el-card shadow="hover" class="card">
          <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
          <span size="mini">Dark</span>
        </el-card>
      </el-row>
    </el-row>
    <el-row class="item update">
      <el-row class="title"><i class="el-icon-refresh"></i><span>更新</span></el-row>
      <el-row class="btns">
        <el-button size="small">检查更新</el-button>
      </el-row>
    </el-row>
  </el-row>
</template>
<script lang="ts">
import Vue from 'vue'
import { shell } from 'electron'
export default Vue.extend({
  methods: {
    linkOpen (e:string) {
      if (e) {
        shell.openExternal(e)
      }
    }
  }
})
</script>
<style lang="scss" scoped>
.setting{
  .item{
    margin-bottom: 30px;
    .title{
      height: 24px;
      line-height: 24px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      i{
        font-size: 24px;
        margin-right: 6px;
      }
    }
  }
  .about{
    ul{
      list-style: none;
      li{
        height: 30px;
      }
    }
  }
  .theme{
    .card-box{
      display: flex;
      justify-content: flex-start;
      .card{
        width: 160px;
        margin-right: 20px;
        text-align: center;
        cursor: pointer;
        img{
          width: 100%;
        }
        span{
          font-size: 14px;
          margin-top: 10px;
        }
      }
    }
  }
}
</style>
