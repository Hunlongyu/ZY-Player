<template>
  <Row>
    <Button type="primary" @click="changeTheme('light')">light</Button>
    <Button type="primary" @click="changeTheme('dark')">Dark</Button>
    <Button type="primary" @click="add()">Add</Button>
  </Row>
</template>
<script>
import { mapActions } from 'vuex'
import { collection } from '@/plugin/localforage/'
export default {
  name: 'settings',
  methods: {
    ...mapActions([
      'changeTheme'
    ]),
    add () {
      // let data = {
      //   name: '冰雪奇缘',
      //   detail: '',
      //   category: '动画片',
      //   time: '20191206 12:12:45'
      // }
      collection.all().then(e => {
        console.log(e)
      })
    }
  },
  created () {}
}
</script>
