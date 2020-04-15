<template>
  <div class="detail">
    <div class="detail-content">
      <div class="detail-header">
        <span class="detail-title">详情</span>
        <span class="detail-close" @click="closeDetail">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="closeIconTitle">
            <title id="closeIconTitle">关闭</title>
            <path d="M6.34314575 6.34314575L17.6568542 17.6568542M6.34314575 17.6568542L17.6568542 6.34314575"></path>
          </svg>
        </span>
      </div>
      <div class="detail-body" v-show="!loading" :style="{overflowY:scroll? 'auto' : 'hidden',paddingRight: scroll ? '0': '5px' }" @mouseenter="scroll = true" @mouseleave="scroll = false">
        <div class="info" v-html="vDetail.info"></div>
        <div class="desc" v-html="vDetail.desc" v-if="show.desc"></div>
        <div class="m3u8_urls">
          <div class="title">播放:</div>
          <div class="box">
            <span v-for="(i, j) in vDetail.m3u8_urls" :key="j" @click="playEvent(i)">{{i | ftName}}</span>
          </div>
        </div>
        <div class="mp4_urls" v-if="show.download">
          <div class="title">下载链接:</div>
          <div class="box">
            <span v-for="(i, j) in vDetail.mp4_urls" :key="j" @click="download(i)">{{i | ftName}}</span>
            <span @click="allDownload" v-show="vDetail.mp4_urls.length > 1">全集下载</span>
          </div>
        </div>
      </div>
      <div class="detail-mask" v-show="loading">
        <div class="loader"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import tools from '../lib/site/tools'
// const { clipboard } = require('electron')
export default {
  name: 'detail',
  data () {
    return {
      scroll: false,
      loading: true,
      vDetail: {},
      show: {
        desc: false,
        download: false
      }
    }
  },
  filters: {
    ftName (e) {
      const name = e.split('$')[0]
      return name
    }
  },
  computed: {
    view: {
      get () {
        return this.$store.getters.getView
      },
      set (val) {
        this.SET_VIEW(val)
      }
    },
    video: {
      get () {
        return this.$store.getters.getVideo
      },
      set (val) {
        this.SET_VIDEO(val)
      }
    },
    detail: {
      get () {
        return this.$store.getters.getDetail
      },
      set (val) {
        this.SET_DETAIL(val)
      }
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_VIDEO', 'SET_DETAIL']),
    closeDetail () {
      this.detail.show = false
    },
    getDetail () {
      tools.detail_get(this.detail.v.site, this.detail.v.detail).then(res => {
        this.vDetail = res
        if (res.desc.length > 0) {
          this.show.desc = true
        }
        if (res.mp4_urls.length > 0) {
          this.show.download = true
        }
        this.$nextTick(() => {
          this.loading = false
        })
      })
    },
    playEvent (e) {
      this.video = this.detail.v
      this.detail.show = false
      this.view = 'Play'
    }
    // download (e) {
    //   const name = e.split('$')[0]
    //   const txt = encodeURI(e.split('$')[1])
    //   clipboard.writeText(txt)
    //   this.$message.success(`已复制 ${name} 下载链接, 快去下载吧!`)
    // },
    // allDownload () {
    //   const urls = [...this.vDetail.mp4_urls]
    //   let txt = ''
    //   for (const i of urls) {
    //     const url = encodeURI(i.split('$')[1])
    //     txt += (url + '\n')
    //   }
    //   clipboard.writeText(txt)
    //   this.$message.success('已复制全集下载链接, 快去下载吧!')
    // }
  },
  created () {
    this.getDetail()
  }
}
</script>
<style lang="scss">
.detail{
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 680px;
  background-color: #fff;
  box-shadow:0 -4px 12px 0 #8e8da21f;
  padding: 10px;
  color: #808695;
  z-index: 999;
  .detail-content{
    height: 660px;
    padding: 10px 40px;
    position: relative;
    .detail-header{
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 -40px;
      .detail-title{
        font-size: 16px;
      }
      .detail-close{
        margin-right: 5px;
        svg{
          width: 24px;
          height: 24px;
          stroke: #823aa099;
          stroke-width: 1;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
          &:hover{
            stroke-width: 2px;
            stroke: #823aa0aa;
          }
        }
        cursor: pointer;
      }
    }
    .detail-body{
      height: 600px;
      overflow-y: auto;
      &::-webkit-scrollbar{
        width: 5px;
        height: 1px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 5px #823aa005;
        background: #823aa055;
        position: absolute;
      }
      &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px #823aa005;
        border-radius: 10px;
        background: #EDEDED;
        position: absolute;
      }
      .info{
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
        width: 970px;
        padding: 10px;
        border: 1px solid #823aa022;
        border-radius: 2px;
        margin-bottom: 10px;
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
          overflow: hidden;
          .vodh{
            margin-bottom: 6px;
            h2{
              display: inline-block;
              margin: 0;
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
          ul{
            padding: 0;
            margin: 0;
          }
          a{
            display: none;
            pointer-events: none;
          }
          li{
            list-style: none;
            font-size: 14px;
            line-height: 18px;
            height: 18px;
            overflow: hidden;
            span{
              word-wrap: nowrap;
            }
          }
        }
        .whitetitle{
          width: 100%;
          font-size: 22px;
          font-weight: bold;
          margin: 4px 0;
        }
        .people{
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          flex-wrap: wrap;
          .left{
            width: 200px;
            img{
              width: 100%;
              height: auto;
            }
          }
          .right{
            flex: 1;
            margin-left: 20px;
            overflow: hidden;
            p{
              font-size: 14px;
            }
            a{
              pointer-events: none;
              color: #808695;
              text-decoration: none;
            }
          }
        }
      }
      .desc{
        border: 1px solid #823aa033;
        padding: 10px;
        width: 970px;
        margin-bottom: 10px;
        border-radius: 2px;
        font-size: 14px;
        line-height: 20px;
      }
      .m3u8_urls, .mp4_urls{
        border: 1px solid #823aa033;
        padding: 10px;
        width: 970px;
        margin-bottom: 10px;
        border-radius: 2px;
        .title{
          font-size: 16px;
        }
        .box{
          width: 100%;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          span{
            font-size: 12px;
            border: 1px solid #823aa055;
            border-radius: 2px;
            cursor: pointer;
            margin: 6px 10px 0px 0px;
            padding: 8px 22px;
            &:hover{
              color: #6e7380;
              background-color: #823aa011;
            }
          }
          &::after {
            content: '';
            flex: 1;
          }
        }
      }
      .mp4_urls{
        margin-bottom: 10px;
      }
    }
    .detail-mask{
      width: 980px;
      height: 600px;
      position: absolute;
      top: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      .loader {
        color: #823aa055;
        font-size: 8px;
        width: 1em;
        height: 1em;
        border-radius: 50%;
        position: relative;
        text-indent: -9999em;
        animation: load4 1.3s infinite linear;
        transform: translateZ(0);
      }
      @keyframes load4 {
        0%,
        100% {
          box-shadow: 0 -3em 0 0.2em, 2em -2em 0 0em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 0;
        }
        12.5% {
          box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em, 3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
        }
        25% {
          box-shadow: 0 -3em 0 -0.5em, 2em -2em 0 0, 3em 0 0 0.2em, 2em 2em 0 0, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
        }
        37.5% {
          box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em, -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
        }
        50% {
          box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em, -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
        }
        62.5% {
          box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0, -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
        }
        75% {
          box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
        }
        87.5% {
          box-shadow: 0em -3em 0 0, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
        }
      }
    }
  }
}
</style>
