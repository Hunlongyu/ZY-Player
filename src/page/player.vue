<template>
  <el-row class="player">
    <el-row class="player-title" type="flex" justify="space-between">
      <span>
        <span>{{Object.keys(video).length !== 0 ? video.name : '无视频'}}</span>
        <span v-if="video.id"> -- {{ urls[video.index] | ftLink}}</span>
      </span>
      <span v-if="video.id">
        <el-button size="mini" @click="openDetail" icon="el-icon-document" circle></el-button>
        <el-button size="mini" icon="el-icon-star-off" circle></el-button>
      </span>
    </el-row>
    <el-row class="player-box">
      <div id="xg"></div>
    </el-row>
    <el-row class="player-films">
      <el-button size="mini" v-for="(i, j) in urls" :key="j" @click="playBtnClick(i, j)">{{i | ftLink}}</el-button>
    </el-row>
  </el-row>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'
import zy from '@/lib/util.zy'
import 'xgplayer'
// @ts-ignore
import Hls from 'xgplayer-hls.js'
export default Vue.extend({
  data () {
    return {
      xg: null,
      config: {
        id: 'xg',
        url: '',
        fluid: false,
        autoplay: true,
        videoInit: true,
        keyShortcut: 'on',
        defaultPlaybackRate: 1,
        playbackRate: [0.5, 0.75, 1, 1.5, 2]
      },
      urls: []
    }
  },
  filters: {
    ftLink (e: string) {
      let name = e.split('$')[0]
      return name
    }
  },
  computed: {
    video: {
      get () {
        return this.$store.getters.getVideo
      },
      set (val) {
        this.SET_VIDEO(val)
      }
    },
    Main () {
      return this.$store.getters.getMain
    }
  },
  watch: {
    video: {
      handler (n, o) {
        if (n.id !== o.id) {
          this.getUrls()
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations(['SET_DETAIL', 'SET_VIDEO']),
    openDetail () {
      if (Object.keys(this.video).length > 0) {
        this.SET_DETAIL(true)
      }
    },
    playVideo (url: string) {
      if (this.xg === null) {
        console.log('lalal')
        // this.config.url = 'this.video.'
        this.xg = new Hls(this.config)
      }
      if (this.xg !== null) {
        this.xg.src = url
      }
    },
    getUrls () {
      zy.detail(this.video.detail).then((res: any) => {
        this.urls = res.urls
        if (this.xg === null) {
          let info: any = this.urls[this.video.index]
          let url = info.split('$')[1]
          console.log(url)
          this.config.url = url
          this.xg = new Hls(this.config)
        }
      })
    },
    playBtnClick (i: string, j: number) {
      this.video.index = j
      let url: string = i.split('$')[1]
      this.playVideo(url)
    }
  },
  created () {
    this.getUrls()
  },
  mounted () {
    if (Hls.isSupported()) {
      if (this.xg === null) {
        // this.xg = new Hls(this.config)
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
