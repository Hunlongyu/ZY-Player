<template>
  <el-row class="film">
    <el-row class="film-tabs">
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane class="film-tabpane" v-for="i in sites[siteNum].type" :key="sites[siteNum].id + i[1]" :label="i[0]" :value="i[1]" :name="i[0]"></el-tab-pane>
      </el-tabs>
    </el-row>
    <el-row class="film-table-box table-box">
      <el-table :data="filmData" stripe class="film-table">
        <el-table-column prop="name" label="影片名称"></el-table-column>
        <el-table-column prop="type" label="影片类别" width="120"></el-table-column>
        <el-table-column prop="time" label="更新时间" width="180"></el-table-column>
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <el-button type="text" @click="tableBtnClick(scope.row)">详情</el-button>
            <el-button type="text" @click="tableBtnClick(scope.row)">收藏</el-button>
            <el-button type="text" @click="tableBtnClick(scope.row)">播放</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="film-bottom" type="flex" justify="space-between">
      <el-select v-model="siteNum" placeholder="请选择" size="small" @change="selectSite">
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
export default Vue.extend({
  data () {
    return {
      sites: sites,
      siteNum: 0,
      activeName: sites[0].type[0][0],
      filmPage: 1,
      filmTotal: 0,
      filmData: [
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' },
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' }
      ]
    }
  },
  methods: {
    tabClick (tab:any) {
      console.log(tab.$attrs.value)
    },
    selectSite (e:any) {
      this.activeName = sites[e].type[0][0]
    }
  },
  created () {}
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
