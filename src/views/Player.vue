<template>
  <Row class="player">
    <div class="title">{{ video.name }}</div>
    <div class="box"></div>
    <div class="list"></div>
    {{video}}
  </Row>
</template>
<script>
import detail from '@/util/util.detail'
export default {
  name: 'player',
  data () {
    return {
      data: {},
      url: null
    }
  },
  computed: {
    video () {
      return this.$store.getters.getVideo
    }
  },
  methods: {
    async getDetail () {
      let url = this.video.detail
      this.data = await detail.getList(url)
      console.log(this.data.m3u8)
    }
  },
  created () {
    this.getDetail()
  }
}
</script>
