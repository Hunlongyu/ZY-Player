<template>
  <el-row class="star">
    <el-row class="star-table-box table-box">
      <el-table :data="filmData" stripe class="film-table" size="mini">
        <el-table-column prop="name" label="影片名称"></el-table-column>
        <el-table-column prop="type" label="影片类别" width="120"></el-table-column>
        <el-table-column prop="time" label="更新时间" width="180"></el-table-column>
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <el-button type="text" @click="tableBtnClick('detail', scope.row)">详情</el-button>
            <el-button type="text" @click="tableBtnClick('delete', scope.row)">删除</el-button>
            <el-button type="text" @click="tableBtnClick('play', scope.row)">播放</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="star-bottom">
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
import video from '@/plugins/dexie/video'
import { mapMutations } from 'vuex'
export default Vue.extend({
  data () {
    return {
      filmData: [],
      filmPage: 1,
      filmTotal: 0
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
    Main: {
      get () {
        return this.$store.getters.getMain
      },
      set (val) {
        this.SET_MAIN(val)
      }
    }
  },
  watch: {
    Main: {
      handler () {
        this.getAllStar()
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations(['SET_DETAIL', 'SET_VIDEO', 'SET_MAIN']),
    getAllStar () {
      video.all().then(res => {
        this.filmData = res
        this.filmTotal = res.length
      })
    },
    tableBtnClick (type: string, e: any) {
      if (type === 'detail') {
        this.SET_DETAIL(true)
        this.video = e
      }
      if (type === 'delete') {
        video.remove(e.id).then(res => {
          if (!res) {
            this.$message.success('删除成功')
          } else {
            this.$message.warning('删除失败, 请重试~')
          }
          this.getAllStar()
        })
      }
      if (type === 'play') {
        this.Main = 'Player'
        this.video = e
      }
    }
  },
  created () {
    this.getAllStar()
  }
})
</script>
<style lang="scss" scoped>
.star{
  height: 100%;
  position: relative;
  .star-table-box{
    position: absolute;
    top: 0px;
    width: 100%;
    height: calc(100% - 40px);
    overflow-y: scroll;
    &::-webkit-scrollbar{
      width: 6px;
    }
  }
  .star-bottom{
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
