<template>
  <div class="share" id="share" @click="shareClickEvent">
    <div class="left">
      <img :src="pic" alt="">
    </div>
    <div class="right">
      <div class="title">{{ share.info.name }}</div>
      <qrcode-vue id="qr" :value="link" :size="160" level="L" />
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
  methods: {
    ...mapMutations(['SET_SHARE']),
    shareClickEvent () {
      this.share = {
        show: false,
        info: {}
      }
    },
    getDetail () {
      this.loading = true
      const id = this.share.info.ids || this.share.info.id
      zy.detail(this.share.key, id).then(res => {
        if (res) {
          this.pic = res.pic
          const text = res.dl.dd
          for (const i of text) {
            if (i._flag.indexOf('m3u8') >= 0) {
              const arr = i._t.split('#')
              const url = arr[0].split('$')[1]
              this.link = 'http://zyplayer.fun/player/player.html?url=' + url + '&title=' + this.share.info.name
            }
          }
          this.loading = false
          this.$nextTick(() => {
            const dom = document.getElementById('share')
            html2canvas(dom, { useCORS: true, allowTaint: true }).then(res => {
              const png = res.toDataURL('image/png')
              const p = nativeImage.createFromDataURL(png)
              clipboard.writeImage(p)
              this.$message.success('已复制到剪贴板，快去分享吧~ 严禁传播违法资源!!!')
            })
          })
        }
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
  padding: 20px;
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
