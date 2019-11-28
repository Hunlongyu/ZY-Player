<template>
  <div class="search">search</div>
</template>
<script>
import video from '@/util/util.video'
export default {
  name: 'search',
  methods: {},
  created () {
    video.init()
  }
}
</script>
