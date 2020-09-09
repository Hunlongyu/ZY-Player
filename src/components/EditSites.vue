<template>
  <div class="detail">
    <div class="detail-content">
      <div class="detail-header">
        <span class="detail-title">源管理</span>
        <span class="detail-close zy-svg" @click="close">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="closeIconTitle">
            <title id="closeIconTitle">关闭</title>
            <path d="M6.34314575 6.34314575L17.6568542 17.6568542M6.34314575 17.6568542L17.6568542 6.34314575"></path>
          </svg>
        </span>
      </div>
      <div class="body zy-scroll">
        <div class="zy-table">
          <div class="tBody zy-scroll">
            <ul>
              <li v-show="sites.length === 0">无数据</li>
              <li v-for="(i, j) in sites" :key="j">
                <span class="name">{{i.name}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { sites } from '../lib/dexie'
export default {
  name: 'editSites',
  data () {
    this.$message.success('In editSites data')
    return {
      show: false,
      sites: []
    }
  },
  computed: {
    view: {
      get () {
        return this.$store.getters.getView
      },
      set (val) {
        this.SET_VIEW(val)
      }
    },
    editSites: {
      get () {
        return this.$store.getters.getEditSites
      },
      set (val) {
        this.SET_EDITSITES(val)
      }
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_EDITSITES']),
    close () {
      this.editSites.show = false
    },
    getSites () {
      sites.all().then(res => {
        this.sites = res
      })
    }
  },
  created () {
    this.getSites()
  }
}

</script>
<style lang="scss" scoped>
.detail{
  position: absolute;
  left: 80px;
  right: 20px;
  bottom: 0;
  width: calc(100% - 100px);
  height: calc(100% - 40px);
  z-index: 888;
  .detail-content{
    height: calc(100% - 10px);
    padding: 0 60px;
    position: relative;
    .detail-header{
      width: 100%;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .detail-title{
        font-size: 16px;
      }
      .detail-close{
        cursor: pointer;
      }
    }
  }
}
</style>
