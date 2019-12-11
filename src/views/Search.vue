<template>
  <div class="search">
    <div :class="active ? 'search-top haveList': 'search-top'" >
      <Input class="search-input" v-model.trim="txt" size="large" search placeholder="输入需要搜索的资源名称..." @on-search="searchEvent" @on-focus="searchFocus" />
    </div>
    <div class="search-middle" v-if="active">
      <Table stripe :columns="columns" :data="data" :loading="loading">
        <template slot-scope="{ row }" slot="action" >
          <Button size="small" @click="play(row)">Play</Button>
          <Button size="small" @click="collection(row)">Star</Button>
          <Button size="small" @click="detail(row)">Detail</Button>
        </template>
      </Table>
    </div>
    <div class="search-bottom" v-if="active">
      <Progress class="progress" :percent="percent" status="active" :stroke-width="10">
        <span class="progress-txt">搜索中</span>
      </Progress>
    </div>
    <Detail v-if="show.detail" />
  </div>
</template>
<script>
import db from '@/plugin/nedb/video'
import video from '@/util/util.video'
import Detail from '@/components/detail.vue'
export default {
  name: 'search',
  data () {
    return {
      txt: '吸血鬼',
      active: true,
      percent: 0,
      columns: [
        {
          title: 'Name',
          key: 'name'
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
      loading: true,
      show: {
        detail: false
      }
    }
  },
  components: {
    Detail
  },
  methods: {
    async searchEvent () {
      if (this.txt !== '') {
        this.data = await video.getList('http://www.666zy.com/', this.txt)
        this.active = true
        this.loading = false
        this.percent = 20
      }
    },
    searchFocus () {
      this.txt = ''
      this.active = false
    },
    play (e) {
      this.$router.push({ name: 'play' })
      this.$store.commit('SET_ICON_ACTIVE', 'play')
      this.$store.commit('SET_VIDEO', e)
    },
    collection (e) {
      let data = {
        category: e.category,
        detail: e.detail,
        name: e.name,
        time: e.time
      }
      db.find({ detail: data.detail }).then(res => {
        console.log(res, 'find')
        if (res.length >= 1) {
          this.$Notice.warning({
            title: '资源已存在',
            backgroud: true
          })
        } else {
          db.add(data).then(res => {
            console.log(res, 'add')
            this.$Notice.success({
              title: '收藏成功',
              backgroud: true
            })
          })
        }
      })
    },
    detail (e) {
      this.show.detail = true
      this.$store.commit('SET_VIDEO', e)
    }
  },
  created () {
    this.searchEvent()
  }
}
</script>
<style lang="scss" scoped>
.search{
  height: 100%;
  position: relative;
  .search-top{
    position: absolute;
    top: 0;
    left: 0;
    height: 60px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: slideDown 0.6s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    .search-input{
      width: 80%;
    }
    &.haveList{
      animation: slideUp 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    }
    @keyframes slideUp {
      from {
        height: 100%;
      }
      to{
        height: 60px;
      }
    }
    @keyframes slideDown {
      from {
        height: 60px;
      }
      to{
        height: 100%;
      }
    }
  }
  .search-middle{
    position: absolute;
    top: 60px;
    width: 100%;
    height: calc(100% - 80px);
    padding: 10px;
    overflow: scroll;
    &::-webkit-scrollbar { display: none }
    animation: fade-in 1.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  }
  @keyframes fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .search-bottom{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0 10px;
    .progress-txt{
      font-size: 10px;
      margin-left: 4px;
    }
    .progress{
      width: 100%;
    }
  }
}
</style>
