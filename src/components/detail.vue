<template>
  <el-row class="detail">
    <el-row class="detail-box" v-loading="loading">
      <el-row v-html="detail.box" class="box"></el-row>
      <el-row v-html="detail.info" class="info"></el-row>
      <el-row class="urls">
        <el-button size="mini" v-for="(i, j) in detail.urls" :key="j" @click="playBtn(i, j)">{{i | ftLink}}</el-button>
      </el-row>
    </el-row>
  </el-row>
</template>
<script lang="ts">
import Vue from 'vue'
import zy from '@/lib/util.zy'
import { mapMutations } from 'vuex'
export default Vue.extend({
  name: 'detail',
  data () {
    return {
      detail: {},
      loading: true
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
    Main: {
      get () {
        return this.$store.getters.getMain
      },
      set (val) {
        this.SET_MAIN(val)
      }
    }
  },
  watch: {
    d () {
      this.getDetailEvent()
    }
  },
  filters: {
    ftLink (e: string) {
      let name = e.split('$')[0]
      return name
    }
  },
  methods: {
    ...mapMutations(['SET_MAIN', 'SET_VIDEO']),
    getDetailEvent () {
      let url = this.d.video.detail
      this.detail = {}
      this.loading = true
      zy.detail(url).then((res: any) => {
        this.detail = res
        this.loading = false
      })
    },
    playBtn (i: string, j: number) {
      if (this.Main !== 'Player') {
        this.d.video.index = j
        this.video = this.d.video
        this.Main = 'Player'
      } else {
        this.d.video.index = j
        this.video = this.d.video
      }
      this.d.show = false
    }
  },
  created () {
    this.getDetailEvent()
  }
})
</script>
<style lang="scss">
.detail{
  box-sizing: border-box;
  padding: 0 60px;
  user-select: auto;
  .detail-box{
    width: 100%;
    .box{
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: wrap;
      width: 100%;
      padding: 10px;
      .vodImg{
        width: 200px;
        img{
          width: 100%;
          height: auto;
        }
      }
      .vodAd{
        display: none;
      }
      .vodInfo{
        flex: 1;
        margin-left: 20px;
        .vodh{
          h2{
            display: inline-block;
          }
          span{
            font-size: 12px;
            margin-left: 10px;
          }
          label{
            font-size: 20px;
            font-weight: bold;
            margin-left: 20px;
          }
        }
        .cont, .tags{
          display: none;
        }
        li{
          list-style: none;
          font-size: 14px;
          height: 20px;
          overflow: hidden;
          a{
            display: none;
            pointer-events: none;
          }
          span{
            word-wrap:break-word
          }
        }
      }
    }
    .info, .urls{
      padding: 10px;
      margin-top: 10px;
    }
    .info{
      font-size: 14px;
    }
    .urls{
      margin-bottom: 20px;
      padding-bottom: 0;
      button{
        margin: 0 10px 10px 0;
      }
    }
  }
}
</style>
