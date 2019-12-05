<template>
  <Row class="player">{{video}}</Row>
</template>
<script>
export default {
  name: 'player',
  computed: {
    video () {
      return this.$store.getters.getVideo
    }
  }
}
</script>
