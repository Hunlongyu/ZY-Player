<template>
  <div class="share" id="share" @click="shareClickEvent" v-clickoutside="shareClickEvent">
    <div class="left">
      <img :src="share.info.pic" alt="">
    </div>
    <div class="right" id="right">
      <div class="title">{{ share.info.name }}</div>
      <qrcode-vue v-if="link !== ''" id="qr" :value="link" :size="160" level="L" />
      <div class="tips">
        <p>长按二维码，识别播放。</p>
        <p><img src="@/assets/image/logo.png"></p>
        <p class="zy">『ZY Player』技术支持，严禁传播违法资源。</p>
      </div>
    </div>
    <div class="share-mask" v-show="loading">
      <div class="loader"></div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import QrcodeVue from 'qrcode.vue'
import html2canvas from 'html2canvas'
import zy from '../lib/site/tools'
import Clickoutside from 'element-ui/src/utils/clickoutside'
const { clipboard, nativeImage } = require('electron')
export default {
  name: 'share',
  data () {
    return {
      pic: '',
      png: '',
      link: '',
      loading: false
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
    },
    DetailCache: {
      get () {
        return this.$store.getters.getDetailCache
      },
      set (val) {
        this.SET_DetailCache(val)
      }
    }
  },
  watch: {
    share: {
      handler () {
        this.getDetail(
          this.loading = true
        )
      },
      deep: true
    }
  },
  directives: {
    Clickoutside
  },
  methods: {
    ...mapMutations(['SET_SHARE', 'SET_DetailCache']),
    shareClickEvent () {
      this.share = {
        show: false,
        info: {}
      }
    },
    async getUrl (index) {
      const id = this.share.info.ids || this.share.info.id
      const cacheKey = this.share.key + '@' + id
      let res = this.DetailCache[cacheKey]
      if (!this.DetailCache[cacheKey]) {
        res = await zy.detail(this.share.key, id)
        this.DetailCache[cacheKey] = res
      }
      if (res) {
        const url = res.fullList[0].list[index]
        return url.includes('$') ? url.split('$')[1] : url
      }
    },
    async getDetail () {
      this.loading = true
      const index = this.share.index || 0
      const url = await this.getUrl(index)
      this.link = 'http://hunlongyu.gitee.io/zy-player-web?url=' + url + '&name=' + this.share.info.name
      this.loading = false
      this.$nextTick(() => {
        const dom = document.getElementById('share')
        html2canvas(dom, { useCORS: true }).then(res => {
          const png = res.toDataURL('image/png')
          const p = nativeImage.createFromDataURL(png)
          clipboard.writeImage(p)
          this.$message.success('已复制到剪贴板，快去分享吧~ 严禁传播违法资源!!!')
        })
      })
    }
  },
  mounted () {
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
  border-radius: 2px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
  z-index: 999;
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
    padding: 10px;
    .title{
      font-size: 18px;
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
