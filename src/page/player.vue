<template>
  <el-row class="player">
    <el-row class="player-title" type="flex" justify="space-between">
      <span>{{title}}</span>
      <span>
        <el-button size="mini" icon="el-icon-document" circle></el-button>
        <el-button size="mini" icon="el-icon-star-off" circle></el-button>
      </span>
    </el-row>
    <el-row class="player-box">
      <div id="xg"></div>
    </el-row>
    <el-row class="player-films">
      <el-button size="mini">第一集</el-button>
    </el-row>
  </el-row>
</template>
<script lang="ts">
import Vue from 'vue'
import 'xgplayer'
// @ts-ignore
import Hls from 'xgplayer-hls.js'
export default Vue.extend({
  data () {
    return {
      xg: null,
      title: '视频标题',
      config: {
        id: 'xg',
        url: 'https://iqiyi.cdn9-okzy.com/20191214/3344_80c1876a/index.m3u8',
        fluid: false,
        autoplay: true,
        keyShortcut: 'on',
        defaultPlaybackRate: 1,
        playbackRate: [0.5, 0.75, 1, 1.5, 2]
      }
    }
  },
  methods: {

  },
  created () {},
  mounted () {
    if (Hls.isSupported()) {
      if (this.xg === null) {
        this.xg = new Hls(this.config)
      }
    } else {
      console.log('haha')
    }
  }
})
</script>
<style lang="scss" scoped>
.player{
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .player-title{
    width: 600px;
    height: 40px;
    line-height: 40px;
  }
  .player-box{
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
  }
  .player-btns, .player-films{
    margin-top: 10px;
    width: 600px;
  }
}
</style>
