<template>
  <div class="detail">
    <div v-show="box" class="detail-box" v-html="data.box"></div>
    <div v-show="box" class="detail-box" v-html="data.info"></div>
    <div v-show="box" class="detail-box">
      <Button v-for="(i, j) in data.m3u8" :key="j" @click="playBtn(i, j, video)">{{i | ftLink}}</Button>
    </div>
  </div>
</template>
<script>
import detail from '@/util/util.detail'
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
      'SET_VIDEO_LIST',
      'SET_DETAIL'
    ]),
    async getDetail () {
      this.box = false
      let url = this.video.detail
      this.data = await detail.getList(url)
      this.SET_VIDEO_LIST(this.data.m3u8)
      this.box = true
    },
    playBtn (i, j, e) {
      console.log(i, j, e, 'playBtn')
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
