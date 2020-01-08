<template>
  <div class="search">
    <div :class="active ? 'search-top haveList': 'search-top'" >
      <Input class="search-input" v-model.trim="txt" size="large" search placeholder="输入需要搜索的资源名称..." @on-search="searchEvent" clearable @on-clear="searchClear">
        <Select slot="prepend" v-model="site" style="width: 120px;">
          <Option v-for="(i, j) in sites" :key="j" :value="j">{{i.name}}</Option>
        </Select>
        <!-- eslint-disable-next-line -->
      </Input>
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
      <Page :total="num" :current.sync="page" :page-size="50" show-total @on-change="onChange" />
    </div>
  </div>
</template>
<script>
import db from '@/plugin/nedb/video'
import zy from '@/lib/util.zy'
import sites from '@/lib/sites'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'search',
  data () {
    return {
      sites: sites,
      txt: '',
      active: false,
      columns: [
        {
          title: 'Name',
          key: 'name',
          minWidth: 240
        },
        {
          title: 'Category',
          key: 'category',
          width: 100,
          align: 'center'
        },
        {
          title: 'Time',
          key: 'time',
          width: 110,
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
      page: 1,
      num: 0,
      loading: true
    }
  },
  computed: {
    ...mapGetters(['getVideo']),
    ...mapGetters({
      getSite: 'getSite'
    }),
    site: {
      get () {
        return this.getSite
      },
      set (val) {
        this.SET_SITE(val)
      }
    }
  },
  methods: {
    ...mapMutations(['SET_SITE']),
    async searchEvent () {
      if (this.txt !== '') {
        this.active = true
        this.loading = true
        this.page = 1
        let z = await zy.info(this.site, this.page, this.txt)
        this.data = z.list
        this.num = z.num
        this.loading = false
      }
    },
    searchClear () {
      this.txt = ''
      this.active = false
      this.loading = true
    },
    async onChange () {
      let z = await zy.info(this.site, this.page, this.txt)
      this.data = z.list
      this.num = z.num
    },
    play (e) {
      if (this.getVideo.detail !== e.detail) {
        this.$store.commit('SET_VIDEO', e)
      }
      this.$store.commit('SET_ICON_ACTIVE', 'play')
      this.$router.push({ name: 'play' })
    },
    async collection (e) {
      let d = await zy.detail(e.detail)
      let data = {
        category: e.category,
        detail: e.detail,
        name: e.name,
        time: e.time,
        type: 'single',
        index: 0,
        urls: [],
        check: false
      }
      data.urls = d.urls
      data.check = true
      this.$store.commit('SET_VIDEO', data)
      db.find({ detail: data.detail }).then(res => {
        if (res.length >= 1) {
          this.$Notice.warning({
            title: '资源已存在',
            backgroud: true
          })
        } else {
          db.add(data).then(res => {
            this.$Notice.success({
              title: '收藏成功',
              backgroud: true
            })
          })
        }
      })
    },
    detail (e) {
      this.$store.commit('SET_VIDEO', e)
      this.$store.commit('SET_ICON_ACTIVE', 'detail')
      this.$router.push({ name: 'detail' })
    }
  },
  created () {
    // this.sites = sites
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
    height: calc(100% - 120px);
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
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0 10px;
  }
}
</style>
