<template>
  <Row class="collection">
    <div class="collectionBox">
      <Table stripe :columns="columns" :data="data" :loading="loading">
        <template slot-scope="{ row }" slot="action" >
          <Button size="small" @click="play(row)">Play</Button>
          <Button size="small" type="info" ghost @click="detailShow(row)">Detail</Button>
          <Button size="small" type="error" ghost @click="deleteLi(row)">Delete</Button>
        </template>
      </Table>
    </div>
  </Row>
</template>
<script>
import db from '@/plugin/nedb/video'
export default {
  name: 'collection',
  data () {
    return {
      columns: [
        {
          title: 'Name',
          key: 'name',
          sortable: true
        },
        {
          title: 'Category',
          key: 'category',
          width: 120,
          align: 'center'
        },
        {
          title: 'Time',
          key: 'time',
          width: 180,
          align: 'center'
        },
        {
          title: 'Action',
          slot: 'action',
          align: 'center',
          width: 260
        }
      ],
      data: [],
      loading: false,
      detail: false
    }
  },
  methods: {
    getList () {
      db.find().then(res => {
        this.data = res
      })
    },
    play (e) {
      this.$router.push({ name: 'play' })
      this.$store.commit('SET_ICON_ACTIVE', 'play')
      this.$store.commit('SET_VIDEO', e)
    },
    detailShow (e) {
      this.$store.commit('SET_ICON_ACTIVE', 'detail')
      this.$store.commit('SET_VIDEO', e)
      this.$router.push({ name: 'detail' })
    },
    deleteLi (e) {
      db.remove(e._id).then(res => {
        this.getList()
      })
    }
  },
  created () {
    this.getList()
  }
}
</script>
<style lang="scss" scoped>
.collection{
  height: 100%;
  position: relative;
  .collectionBox{
    position: absolute;
    width: 100%;
    top: 0px;
    height: 100%;
    overflow: scroll;
    &::-webkit-scrollbar { display: none }
  }
}
</style>
