<template>
  <div class="listpage" id="recommandataions">
    <div class="listpage-header" id="recommandataions-header">
        <el-switch v-model="viewMode" active-text="海报" active-value="picture" inactive-text="列表" inactive-value="list" @change="updateViewMode"></el-switch>
        <el-button type="text">视频数：{{ recommandations.length }}</el-button>
        <el-select v-model="selectedAreas" multiple collapse-tags placeholder="地区" :popper-append-to-body="false">
          <el-option
            v-for="item in areas"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <el-select v-model="selectedTypes" multiple collapse-tags placeholder="类型" :popper-append-to-body="false">
          <el-option
            v-for="item in types"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <el-button :loading="loading" @click.stop="updateEvent" icon="el-icon-refresh">更新推荐</el-button>
    </div>
    <div class="listpage-body" id="recommandataions-body" >
      <div class="show-table" id="star-table" v-show="viewMode === 'list'">
        <el-table size="mini" fit height="100%" row-key="id"
        ref="recommandataionsTable"
        :data="filteredRecommandations"
        @row-click="detailEvent">
          <el-table-column
            prop="name"
            label="片名">
          </el-table-column>
          <el-table-column
            prop="detail.area"
            label="地区"
            width="100">
          </el-table-column>
          <el-table-column
            prop="detail.type"
            label="类型"
            width="100">
          </el-table-column>
          <el-table-column
            prop="detail.year"
            label="上映"
            width="100"
            align="center">
          </el-table-column>
          <el-table-column v-if="filteredRecommandations.some(e => e.detail.note)"
            prop="detail.note"
            width="120"
            label="备注">
          </el-table-column>
          <el-table-column v-if="filteredRecommandations.some(e => e.rate)"
            prop="rate"
            width="120"
            label="豆瓣评分">
          </el-table-column>
          <el-table-column
            label="操作"
            header-align="right"
            align="right">
            <template slot-scope="scope">
              <el-button @click.stop="playEvent(scope.row)" type="text">播放</el-button>
              <el-button @click.stop="shareEvent(scope.row)" type="text">分享</el-button>
              <el-button @click.stop="downloadEvent(scope.row)" type="text">下载</el-button>
              <el-button @click.stop="deleteEvent(scope.row)" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="show-picture" id="star-picture" v-show="viewMode === 'picture'">
        <Waterfall ref="recommandataionsWaterfall" :list="filteredRecommandations" :gutter="20" :width="240"
          :breakpoints="{ 1200: { rowPerView: 4 } }"
          animationEffect="fadeInUp"
          backgroundColor="rgba(0, 0, 0, 0)">
            <template slot="item" slot-scope="props">
              <div class="card">
                <div class="img">
                  <div class="rate" v-if="props.data.rate && props.data.rate !== '暂无评分'">
                    <span>{{props.data.rate}}分</span>
                  </div>
                  <img style="width: 100%" :src="props.data.detail.pic" alt="" @load="$refs.recommandataionsWaterfall.refresh()" @click="detailEvent(props.data)">
                  <div class="operate">
                    <div class="operate-wrap">
                      <span class="o-play" @click="playEvent(props.data)">播放</span>
                      <span class="o-share" @click="shareEvent(props.data)">分享</span>
                      <span class="o-star" @click="downloadEvent(props.data)">下载</span>
                      <span class="o-star" @click="deleteEvent(props.data)">删除</span>
                    </div>
                  </div>
                </div>
                <div class="name" @click="detailEvent(props.data)">{{props.data.name}}</div>
                <div class="info">
                  <span>{{props.data.detail.area}}</span>
                  <span>{{props.data.detail.year}}</span>
                  <span>{{props.data.detail.note}}</span>
                  <span>{{props.data.detail.type}}</span>
                </div>
              </div>
            </template>
        </Waterfall>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { history, recommandation, setting } from '../lib/dexie'
import zy from '../lib/site/tools'
import Waterfall from 'vue-waterfall-plugin'
const { clipboard } = require('electron')
export default {
  name: 'recommandations',
  data () {
    return {
      recommandations: [],
      sites: [],
      viewMode: 'picture',
      loading: false,
      types: [],
      selectedTypes: [],
      areas: [],
      selectedAreas: []
    }
  },
  components: {
    Waterfall
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
    video: {
      get () {
        return this.$store.getters.getVideo
      },
      set (val) {
        this.SET_VIDEO(val)
      }
    },
    detail: {
      get () {
        return this.$store.getters.getDetail
      },
      set (val) {
        this.SET_DETAIL(val)
      }
    },
    share: {
      get () {
        return this.$store.getters.getShare
      },
      set (val) {
        this.SET_SHARE(val)
      }
    },
    filteredRecommandations () {
      var filteredData = this.recommandations.filter(x => (this.selectedAreas.length === 0) || this.selectedAreas.includes(x.detail.area))
      filteredData = filteredData.filter(x => (this.selectedTypes.length === 0) || this.selectedTypes.includes(x.detail.type))
      return filteredData
    }
  },
  watch: {
    view () {
      if (this.view === 'Recommandation') {
        this.getRecommandations()
        this.$refs.recommandataionsWaterfall.refresh()
      }
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_DETAIL', 'SET_VIDEO', 'SET_SHARE']),
    detailEvent (e) {
      this.detail = {
        show: true,
        key: e.key,
        info: {
          id: e.ids,
          name: e.name
        }
      }
    },
    updateEvent () {
      const url = 'https://raw.githubusercontent.com/Hunlongyu/ZY-Player/master/src/lib/dexie/iniData/Recommandations.json'
      this.loading = true
      const axios = require('axios')
      axios.get(url).then(res => {
        if (res.status === 200) {
          if (res.data.length > 0) {
            this.recommandations = res.data
            this.recommandations.sort(function (a, b) {
              return b.detail.year - a.detail.year
            })
            recommandation.clear().then(recommandation.bulkAdd(this.recommandations))
            this.getFilterData()
            this.$message.success('更新推荐成功')
          }
        }
        this.loading = false
      })
    },
    async playEvent (e) {
      const db = await history.find({ site: e.key, ids: e.ids })
      if (db) {
        this.video = { key: e.key, info: { id: db.ids, name: db.name, index: db.index } }
      } else {
        this.video = { key: e.key, info: { id: e.ids, name: e.name, index: 0 } }
      }
      this.view = 'Play'
    },
    deleteEvent (e) {
      recommandation.remove(e.id).then(res => {
        if (res) {
          this.$message.warning('删除失败')
        } else {
          this.$message.success('删除成功')
        }
        this.getRecommandations()
      })
    },
    shareEvent (e) {
      this.share = {
        show: true,
        key: e.key,
        info: e
      }
    },
    downloadEvent (e) {
      zy.download(e.key, e.ids).then(res => {
        if (res && res.dl && res.dl.dd) {
          const text = res.dl.dd._t
          if (text) {
            const list = text.split('#')
            let downloadUrl = ''
            for (const i of list) {
              const url = encodeURI(i.split('$')[1])
              downloadUrl += (url + '\n')
            }
            clipboard.writeText(downloadUrl)
            this.$message.success('『MP4』格式的链接已复制, 快去下载吧!')
          } else {
            this.$message.warning('没有查询到下载链接.')
          }
        } else {
          var m3u8List = {}
          zy.detail(e.key, e.ids).then(res => {
            const dd = res.dl.dd
            const type = Object.prototype.toString.call(dd)
            if (type === '[object Array]') {
              for (const i of dd) {
                if (i._flag.indexOf('m3u8') >= 0) {
                  m3u8List = i._t.split('#')
                }
              }
            } else {
              m3u8List = dd._t.split('#')
            }
            const list = [...m3u8List]
            let downloadUrl = ''
            for (const i of list) {
              const url = encodeURI(i.split('$')[1])
              downloadUrl += (url + '\n')
            }
            clipboard.writeText(downloadUrl)
            this.$message.success('『M3U8』格式的链接已复制, 快去下载吧!')
          })
        }
      })
    },
    getRecommandations () {
      recommandation.all().then(res => {
        this.recommandations = res
        this.recommandations.sort(function (a, b) {
          return b.detail.year - a.detail.year
        })
        this.getFilterData()
      })
    },
    getFilterData () {
      this.types = [...new Set(this.recommandations.map(ele => ele.detail.type))].filter(x => x)
      this.areas = [...new Set(this.recommandations.map(ele => ele.detail.area))].filter(x => x)
    },
    getViewMode () {
      setting.find().then(res => {
        this.viewMode = res.recommandationViewMode
      })
    },
    updateViewMode () {
      setting.find().then(res => {
        res.recommandationViewMode = this.viewMode
        setting.update(res)
      })
    }
  },
  created () {
    this.getRecommandations()
    this.getViewMode()
  }
}
</script>
