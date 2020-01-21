<template>
  <el-row class="setting">
    <el-row class="item site">
      <el-row class="title"><i class="el-icon-set-up"></i><span>默认资源</span></el-row>
      <el-row class="info">
        <el-select v-model="dbSite" placeholder="请选择" size="small" @change="selectSite">
          <el-option
            v-for="(i, j) in sites"
            :key="i.id"
            :label="i.name"
            :value="j">
          </el-option>
        </el-select>
      </el-row>
    </el-row>
    <el-row class="item theme">
      <el-row class="title"><i class="el-icon-picture-outline-round"></i><span>主题</span></el-row>
      <el-row class="card-box">
        <el-card shadow="hover" class="card">
          <img src="@/assets/image/light.png" class="image" @click="selectTheme('light')">
          <span size="mini">Light</span>
        </el-card>
        <el-card shadow="hover" class="card">
          <img src="@/assets/image/dark.png" class="image" @click="selectTheme('dark')">
          <span size="mini">Dark</span>
        </el-card>
      </el-row>
    </el-row>
    <el-row class="item update about">
      <el-row class="title"><i class="el-icon-refresh"></i><span>更新</span></el-row>
      <el-row class="info">
        <ul>
          <li>当前版本: {{oldVersion}}</li>
          <li>最新版本: {{newVersion}}</li>
        </ul>
      </el-row>
      <el-row class="btns">
        <el-button v-show="download" size="small" @click="linkOpen('https://github.com/Hunlongyu/ZY-Player/releases/latest')">下载更新</el-button>
      </el-row>
    </el-row>
    <el-row class="item about">
      <el-row class="title"><i class="el-icon-view"></i><span>关于</span></el-row>
      <el-row class="info">
        <ul>
          <li><el-link :underline="false" @click="linkOpen('http://zy_player.hunlongyu.fun')">官网: ZY Player</el-link></li>
          <li><el-link :underline="false" @click="linkOpen('https://github.com/Hunlongyu/ZY-Player/issues')">反馈: Issues</el-link></li>
        </ul>
      </el-row>
    </el-row>
  </el-row>
</template>
<script lang="ts">
import Vue from 'vue'
import sites from '@/lib/sites'
import { mapMutations } from 'vuex'
import { shell } from 'electron'
import site from '@/plugins/dexie/site'
import theme from '@/plugins/dexie/theme'
import fly from 'flyio'
export default Vue.extend({
  name: 'setting',
  data () {
    return {
      sites: sites,
      dbSite: 0,
      oldVersion: 'v0.7.23',
      newVersion: '',
      download: false
    }
  },
  computed: {
    site: {
      get () {
        return this.$store.getters.getSite
      },
      set (val) {
        this.SET_SITE(val)
      }
    },
    theme: {
      get () {
        return this.$store.getters.getTheme
      },
      set (val) {
        this.SET_THEME(val)
      }
    }
  },
  methods: {
    ...mapMutations(['SET_SITE', 'SET_THEME']),
    linkOpen (e:string) {
      if (e) {
        shell.openExternal(e)
      }
    },
    initSetting () {
      site.find().then(res => {
        if (!res) {
          site.add({ site: 0 })
        } else {
          this.dbSite = res.site
          this.site = res.site
        }
      })
      theme.find().then(res => {
        if (!res) {
          theme.add({ theme: 'light' })
        } else {
          this.theme = res.theme
        }
      })
    },
    selectSite () {
      site.update({ site: this.dbSite }).then(res => {
        this.site = this.dbSite
        this.$message.success('设置默认资源成功~')
      }).catch(() => {
        this.$message.warning('设置默认资源失败~')
      })
    },
    selectTheme (e: string) {
      theme.update({ theme: e }).then(res => {
        this.theme = e
        this.$message.success('切换主题成功~')
      }).catch(() => {
        this.$message.warning('切换主题失败~')
      })
    },
    checkUpdate () {
      fly.get('https://api.github.com/repos/Hunlongyu/ZY-Player/releases/latest').then(res => {
        this.newVersion = res.data.tag_name
        if (res.data.tag_name !== this.oldVersion) {
          this.download = true
        } else {
          this.download = false
        }
      })
    }
  },
  created () {
    this.initSetting()
    this.checkUpdate()
  }
})
</script>
<style lang="scss" scoped>
.setting{
  .item{
    margin-bottom: 30px;
    .title{
      height: 24px;
      line-height: 24px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      i{
        font-size: 24px;
        margin-right: 6px;
      }
    }
  }
  .about{
    ul{
      list-style: none;
      li{
        height: 30px;
      }
    }
  }
  .theme{
    .card-box{
      display: flex;
      justify-content: flex-start;
      .card{
        width: 160px;
        margin-right: 20px;
        text-align: center;
        img{
          cursor: pointer;
          width: 100%;
        }
        span{
          font-size: 14px;
          margin-top: 10px;
        }
      }
    }
  }
}
</style>
