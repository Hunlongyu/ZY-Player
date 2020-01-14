<template>
  <el-row class="search">
    <el-row class="search-box">
      <el-input class="search-input" size="medium" placeholder="请输入内容" v-model="keywords">
        <el-select v-model="siteNum" slot="prepend" placeholder="请选择" @change="selectSite" style="width: 130px;">
          <el-option v-for="(i, j) in sites" :key="i.id" :label="i.name" :value="j"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </el-row>
    <el-row class="search-table-box table-box">
      <el-table :data="filmData" stripe class="search-table">
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
    <el-row class="search-bottom" type="flex" justify="end">
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
import sites from '@/lib/sites'
export default Vue.extend({
  data () {
    return {
      sites: sites,
      siteNum: 1,
      keywords: '',
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
      ],
      filmPage: 1,
      filmTotal: 100
    }
  },
  methods: {
    selectSite (e:number) {
      this.siteNum = e
    }
  }
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
