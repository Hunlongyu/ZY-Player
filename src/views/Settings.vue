<template>
  <Row>
    <Button type="primary" @click="changeTheme({ id: getTheme.id, color: 'light' })">light</Button>
    <Button type="primary" @click="changeTheme({ id: getTheme.id, color: 'dark' })">Dark</Button>
    <Button type="primary" @click="add()">Add</Button>
  </Row>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import settingDB from '@/plugin/nedb/setting'
export default {
  name: 'settings',
  computed: {
    ...mapGetters([
      'getTheme'
    ])
  },
  methods: {
    ...mapActions([
      'changeTheme'
    ]),
    add () {
      let data = {
        name: '冰雪奇缘',
        detail: '1',
        category: '动画片',
        time: '20191206 12:12:45'
      }
      settingDB.add(data).then(res => {
        console.log(res)
      })
    }
  },
  created () {}
}
</script>
