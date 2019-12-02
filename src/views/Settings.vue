<template>
  <Row>
    <Button type="primary" @click="switchTheme('light')">light</Button>
    <Button type="primary" @click="switchTheme('dark')">Dark</Button>
  </Row>
</template>
<script>
export default {
  name: 'settings',
  methods: {
    switchTheme (e) {
      this.$store.commit('SET_THEME', e)
    }
  }
}
</script>
