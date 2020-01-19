<template>
  <el-row class="player">
    <el-row class="player-title">
      <el-row class="player-title-box" type="flex" justify="space-between">
        <span>
          <span>{{Object.keys(video).length !== 0 ? video.name + ' -- ' : '无视频 -- '}}</span>
          <span>{{ num }}</span>
        </span>
        <span v-show="Object.keys(video).length > 0">
          <el-button size="mini" @click="openDetail" icon="el-icon-document" circle></el-button>
          <el-button size="mini" v-show="!star" @click="starEvent" icon="el-icon-star-off" circle></el-button>
          <el-button size="mini" v-show="star" @click="starEvent" icon="el-icon-star-on" circle></el-button>
        </span>
      </el-row>
    </el-row>
    <el-row class="player-box">
      <div id="xg"></div>
    </el-row>
    <el-row class="player-films table-box">
      <el-row class="player-films-box">
        <el-button :type="j === video.index ? 'primary' : ''" size="mini" v-for="(i, j) in urls" :key="j" @click="playBtnClick(i, j)" plain>{{i | ftLink}}</el-button>
      </el-row>
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
import video from '@/plugins/dexie/video'
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
      urls: [],
      num: '',
      star: false
    }
  },
  computed: {
    d () {
      return this.$store.getters.getDetail
    },
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
      handler () {
        this.getUrls()
      },
      deep: true
    }
  },
  filters: {
    ftLink (e: string) {
      let name = e.split('$')[0]
      return name
    }
  },
  methods: {
    ...mapMutations(['SET_DETAIL', 'SET_VIDEO']),
    openDetail () {
      let d = {
        show: true,
        video: this.video
      }
      this.SET_DETAIL(d)
    },
    getUrls () {
      if (this.xg) {
        // @ts-ignore
        this.xg.destroy(true)
        this.xg = null
      }
      this.checkStar()
      zy.detail(this.video.detail).then((res: any) => {
        this.urls = res.urls
        if (this.xg === null) {
          let info: any = this.urls[this.video.index]
          let url = info.split('$')[1]
          this.num = info.split('$')[0]
          this.config.url = url
          this.$nextTick(() => {
            this.xg = new Hls(this.config)
            // @ts-ignore
            this.xg.on('error', () => {
              this.$message.error('播放失败请重试~')
            })
          })
        }
      })
    },
    checkStar () {
      video.find({ detail: this.video.detail }).then(res => {
        if (res) {
          this.star = true
        } else {
          this.star = false
        }
      })
    },
    starEvent () {
      video.find({ detail: this.video.detail }).then(res => {
        if (res) {
          video.remove(res.id).then(res => {
            if (!res) {
              this.$message.success('删除成功')
              this.star = false
            } else {
              this.$message.warning('删除失败, 请重试~')
            }
          })
        } else {
          video.add(this.video).then(res => {
            this.star = true
            this.$message.success('收藏成功')
          })
        }
      })
    },
    playBtnClick (i: string, j: number) {
      if (this.video.index !== j) {
        let url = i.split('$')[1]
        this.num = i.split('$')[0]
        this.video.index = j
        // @ts-ignore
        this.xg.src = url
      }
    }
  }
})
</script>
<style lang="scss" scoped>
.player{
  height: 100%;
  width: 100%;
  position: relative;
  .player-title{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    .player-title-box{
      width: 600px;
      margin: 0 auto;
    }
  }
  .player-box{
    position: absolute;
    top: 50px;
    left: 0;
    width: 100%;
    height: 350px;
    #xg{
      margin: 0 auto;
    }
  }
  .player-films{
    position: absolute;
    top: 400px;
    left: 0;
    width: 100%;
    height: calc(100% - 400px);
    overflow: auto;
    button{
      margin: 0 10px 10px 0;
    }
    &::-webkit-scrollbar{
      width: 6px;
    }
    .player-films-box{
      width: 600px;
      margin: 0 auto;
    }
  }
}
</style>
