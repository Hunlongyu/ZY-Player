<template>
  <div class="share" id="share" @click="shareClickEvent">
    <div class="left">
      <img :src="this.card.img" alt="">
    </div>
    <div class="right">
      <div class="title">{{ card.name }}</div>
      <qrcode-vue id="qr" :value="value" :size="160" level="L" />
      <div class="tips">
        <p>{{$t('qr_tips')}}</p>
        <p><img src="@/assets/image/logo.png"></p>
        <p class="zy">{{$t('zy_tips')}}</p>
      </div>
    </div>
    <div class="share-mask" v-show="loading">
      <div class="loader"></div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import tools from '../lib/site/tools'
import QrcodeVue from 'qrcode.vue'
import html2canvas from 'html2canvas'
const { clipboard, nativeImage } = require('electron')
export default {
  name: 'share',
  data () {
    return {
      card: {
        img: '',
        name: '',
        png: ''
      },
      value: 'https://www.baidu.com',
      loading: true
    }
  },
  components: {
    QrcodeVue
  },
  computed: {
    share: {
      get () {
        return this.$store.getters.getShare
      },
      set (val) {
        this.SET_SHARE(val)
      }
    }
  },
  watch: {
    share: {
      handler () {
        this.getDetail()
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations(['SET_SHARE']),
    getDetail () {
      this.loading = true
      tools.detail_get(this.share.v.site, this.share.v.detail).then(res => {
        const info = res.info
        const parser = new DOMParser()
        const html = parser.parseFromString(info, 'text/html')
        const img = html.querySelector('img').src
        this.card.img = img
        this.card.name = this.share.v.name
        const urls = res.m3u8_urls
        const url = urls[this.share.v.index].split('$')[1]
        this.value = 'http://m3u8.hunlongyu.fun/?url=' + url + '&title=' + this.share.v.name
        this.loading = false
        this.$nextTick(() => {
          const dom = document.getElementById('share')
          html2canvas(dom, { allowTaint: true, useCORS: true }).then(res => {
            const png = res.toDataURL('image/png')
            const p = nativeImage.createFromDataURL(png)
            clipboard.writeImage(p)
            this.$message.success(this.$t('share_tips'))
            this.share.show = true
          })
        })
      })
    },
    shareClickEvent () {
      this.share = {
        show: false,
        v: {}
      }
    }
  },
  created () {
    this.getDetail()
  }
}
</script>
<style lang="scss" scoped>
.share{
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 540px;
  height: 360px;
  background-color: #fff;
  border-radius: 2px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #cfcfcf;
  padding: 20px;
  z-index: 888;
  .left, .right{
    width: 50%;
    height: 100%;
  }
  .left{
    display: flex;
    justify-content: center;
    align-items: center;
    img{
      height: 320px;
      width: auto;
      max-width: 240px;
    }
  }
  .right{
    .title{
      font-size: 18px;
      color: #666;
      margin-bottom: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    #qr{
      text-align: center;
    }
    .tips{
      font-size: 14px;
      text-align: center;
      color: #808695;
      img{
        width: 50px;
      }
      .zy{
        font-size: 12px;
      }
    }
  }
  .share-mask{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
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
</style>
