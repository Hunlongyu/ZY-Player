<template>
  <div class="detail">
    <div v-show="box" class="detail-box" v-html="data.box"></div>
    <div v-show="box" class="detail-box" v-html="data.info"></div>
    <div v-show="box" class="detail-box">
      <Button v-for="(i, j) in data.urls" :key="j" @click="playBtn(i, j, video)">{{i | ftLink}}</Button>
    </div>
  </div>
</template>
<script>
import haku from '@/util/util.666zy'
import { mapMutations } from 'vuex'
export default {
  name: 'detail',
  data () {
    return {
      data: {
        box: null,
        info: null,
        m3u8: null
      },
      box: false
    }
  },
  filters: {
    ftLink (e) {
      let name = e.split('$')[0]
      return name
    }
  },
  computed: {
    video () {
      return this.$store.getters.getVideo
    }
  },
  methods: {
    ...mapMutations([
      'SET_VIDEO'
    ]),
    async getDetail () {
      this.box = false
      let url = this.video.detail
      this.data = await haku.getDetail(url)
      this.video.urls = this.data.urls
      this.video.check = true
      this.box = true
    },
    playBtn (i, j, e) {
      this.video.index = j
      this.$store.commit('SET_VIDEO', this.video)
      this.$router.push({ name: 'play' })
      this.$store.commit('SET_ICON_ACTIVE', 'play')
    }
  },
  created () {
    this.getDetail()
  }
}
</script>
<style lang="scss" scoped>
.detail{
  .btns{
    margin-bottom: 10px;
  }
  .detail-box{
    button{
      margin: 4px;
    }
  }
}
</style>
