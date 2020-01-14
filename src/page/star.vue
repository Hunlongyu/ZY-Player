<template>
  <el-row class="star">
    <el-row class="star-table-box table-box">
      <el-table :data="filmData" stripe class="film-table">
        <el-table-column prop="name" label="影片名称"></el-table-column>
        <el-table-column prop="type" label="影片类别" width="120"></el-table-column>
        <el-table-column prop="time" label="更新时间" width="180"></el-table-column>
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <el-button type="text" @click="tableBtnClick(scope.row)">详情</el-button>
            <el-button type="text" @click="tableBtnClick(scope.row)">删除</el-button>
            <el-button type="text" @click="tableBtnClick(scope.row)">播放</el-button>
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
export default Vue.extend({
  data () {
    return {
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
        { name: '锁链战记_赫克瑟塔斯之光剧场版 3集全/已完结', type: '动作片', time: '2019-08-08 17:37:48' }
      ],
      filmPage: 1,
      filmTotal: 120
    }
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
