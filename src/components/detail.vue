<template>
  <el-row class="detail">
    <el-row class="detail-box" v-loading="loading">
      <el-row v-html="detail.box" class="box"></el-row>
      <el-row class="urls">
        <el-button size="mini" v-for="(i, j) in detail.urls" :key="j" @click="playBtn(i, j, video)">{{i | ftLink}}</el-button>
      </el-row>
      <el-row v-html="detail.info" class="info"></el-row>
    </el-row>
  </el-row>
</template>
<script lang="ts">
import Vue from 'vue'
import zy from '@/lib/util.zy'
export default Vue.extend({
  name: 'detail',
  data () {
    return {
      detail: {},
      loading: true
    }
  },
  computed: {
    video () {
      return this.$store.getters.getVideo
    }
  },
  filters: {
    ftLink (e: string) {
      let name = e.split('$')[0]
      return name
    }
  },
  watch: {
    video: {
      handler (n) {
        this.getDetailEvent(n)
      },
      deep: true
    }
  },
  methods: {
    getDetailEvent (n: any) {
      this.detail = {}
      this.loading = true
      zy.detail(n.detail).then((res: any) => {
        this.detail = res
        this.loading = false
      })
    },
    playBtn (i: string, j: number, video: any) {
      console.log(i, j, video)
    }
  },
  created () {},
  mounted () {
    this.getDetailEvent(this.video)
  }
})
</script>
<style lang="scss">
.detail{
  box-sizing: border-box;
  padding: 0 60px;
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
      padding-bottom: 0;
      button{
        margin: 0 10px 10px 0;
      }
    }
  }
}
</style>
