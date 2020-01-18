<template>
  <el-row class="search">
    <el-row class="search-box">
      <el-input class="search-input" size="medium" clearable placeholder="请输入内容" v-model.trim="keywords" @change="searchEvent">
        <el-select v-model="site" slot="prepend" placeholder="请选择" @change="selectSite" style="width: 130px;">
          <el-option v-for="(i, j) in sites" :key="i.id" :label="i.name" :value="j"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="searchEvent"></el-button>
      </el-input>
    </el-row>
    <el-row class="search-table-box table-box">
      <el-table :data="filmData" stripe class="search-table" size="mini" v-loading="loading">
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
    <el-row class="search-bottom" type="flex" justify="end">
      <el-pagination
        small
        layout="total, prev, pager, next, jumper"
        :current-page="filmPage"
        :page-size="50"
        @current-change="pageChange"
        :total="filmTotal">
      </el-pagination>
    </el-row>
  </el-row>
</template>
<script lang="ts">
import Vue from 'vue'
import sites from '@/lib/sites'
import zy from '@/lib/util.zy'
import { mapMutations } from 'vuex'
import video from '@/plugins/dexie/video'
export default Vue.extend({
  data () {
    return {
      sites: sites,
      keywords: '',
      filmData: [],
      filmPage: 1,
      filmTotal: 0,
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
    selectSite (e:number) {
      this.site = e
      this.filmData = []
      this.filmPage = 1
      this.filmTotal = 0
      this.searchEvent()
    },
    searchEvent () {
      if (this.keywords !== '') {
        this.loading = true
        zy.info(this.site, this.filmPage, this.keywords).then((res: any) => {
          this.filmData = res.list
          this.filmTotal = res.total
          this.loading = false
        })
      }
    },
    pageChange (e:number) {
      this.filmPage = e
      this.searchEvent()
    },
    tableBtnClick (type: string, e: any) {
      if (type === 'detail') {
        this.SET_DETAIL(true)
        this.video = e
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
  created () {}
})
</script>
<style lang="scss" scoped>
.search{
  height: 100%;
  position: relative;
  .search-box{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 40px;
  }
  .search-table-box{
    position: absolute;
    top: 40px;
    width: 100%;
    height: calc(100% - 100px);
    overflow-y: scroll;
    &::-webkit-scrollbar{
      width: 6px;
    }
    .search-table{
      width: 100%;
    }
  }
  .search-bottom{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
