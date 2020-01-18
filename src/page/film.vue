<template>
  <el-row class="film">
    <el-row class="film-tabs">
      <el-tabs v-model="tabs" @tab-click="tabClick">
        <el-tab-pane class="film-tabpane" v-for="(i, j) in sites[site].type" :key="j" :label="i[0]" :value="i[1]"></el-tab-pane>
      </el-tabs>
    </el-row>
    <el-row class="film-table-box table-box">
      <el-table :data="filmData" stripe class="film-table" v-loading="loading" size="mini">
        <el-table-column prop="name" label="影片名称"></el-table-column>
        <el-table-column prop="type" label="影片类别" width="120"></el-table-column>
        <el-table-column prop="time" label="更新时间" width="180"></el-table-column>
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <el-button type="text" @click="tableBtnClick('detail', scope.row)">详情</el-button>
            <el-button type="text" @click="tableBtnClick('star', scope.row)">收藏</el-button>
            <el-button type="text" @click="tableBtnClick('play', scope.row)">播放</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="film-bottom" type="flex" justify="space-between">
      <el-select v-model="site" placeholder="请选择" size="small" @change="selectSite">
        <el-option
          v-for="(i, j) in sites"
          :key="i.id"
          :label="i.name"
          :value="j">
        </el-option>
      </el-select>
      <el-pagination
        small
        layout="total, prev, pager, next, jumper"
        :current-page="filmPage"
        :page-size="50"
        :total="filmTotal">
      </el-pagination>
    </el-row>
  </el-row>
</template>
<script lang="ts">
import Vue from 'vue'
import zy from '@/lib/util.zy'
import sites from '@/lib/sites'
import { mapMutations } from 'vuex'
import video from '@/plugins/dexie/video'
export default Vue.extend({
  data () {
    return {
      sites: sites,
      tabs: 0,
      filmPage: 1,
      filmTotal: 0,
      filmData: [],
      loading: false
    }
  },
  computed: {
    video: {
      get () {
        return this.$store.getters.getVideo
      },
      set (val) {
        this.SET_VIDEO(val)
      }
    },
    site: {
      get () {
        return this.$store.getters.getSite
      },
      set (val) {
        this.SET_SITE(val)
      }
    },
    Main: {
      get () {
        return this.$store.getters.getMain
      },
      set (val) {
        this.SET_MAIN(val)
      }
    }
  },
  methods: {
    ...mapMutations(['SET_SITE', 'SET_DETAIL', 'SET_MAIN', 'SET_VIDEO']),
    tabClick (tab:any) {
      this.getFilmList(this.site, this.filmPage, tab.$attrs.value)
    },
    selectSite (e:any) {
      this.site = e
      this.filmPage = 1
      this.getFilmList(e, 1, 0)
    },
    getFilmList (n: number = 0, p: number = 1, type: number = 0) {
      this.loading = true
      this.filmData = []
      zy.films(n, p, type).then((res: any) => {
        this.filmTotal = res.total
        this.filmData = res.list
        this.filmPage = p
        this.loading = false
      })
    },
    tableBtnClick (type: string, e: any) {
      if (type === 'detail') {
        this.video = e
        this.SET_DETAIL(true)
      }
      if (type === 'star') {
        video.find({ detail: e.detail }).then(res => {
          if (res) {
            this.$message.warning('已存在')
          } else {
            video.add(e).then(res => {
              this.$message.success('收藏成功')
            })
          }
        })
      }
      if (type === 'play') {
        this.Main = 'Player'
        this.video = e
      }
    }
  },
  created () {
    this.getFilmList()
  }
})
</script>
<style lang="scss" scoped>
.film{
  height: 100%;
  position: relative;
  .film-tabs{
    position: absolute;
    top: 0px;
    left: 0;
    width: 100%;
    height: 60px;
  }
  .film-table-box{
    position: absolute;
    top: 54px;
    width: 100%;
    height: calc(100% - 100px);
    overflow-y: scroll;
    &::-webkit-scrollbar{
      width: 6px;
    }
  }
  .film-bottom{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40px;
    align-items: center;
  }
}
</style>
