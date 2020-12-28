<template>
  <div class="listpage" id="recommendations">
    <div class="listpage-header" id="recommendations-header">
        <el-switch v-model="setting.recommendationViewMode" active-text="海报" active-value="picture" inactive-text="列表" inactive-value="table" @change="updateViewMode"></el-switch>
        <el-button type="text">视频数：{{ recommendations.length }}</el-button>
        <el-select v-model="selectedAreas" size="small" multiple placeholder="地区" popper-class="popper" :popper-append-to-body="false">
          <el-option
            v-for="item in areas"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <el-select v-model="selectedTypes" size="small" multiple placeholder="类型" popper-class="popper" :popper-append-to-body="false">
          <el-option
            v-for="item in types"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <el-select v-model="sortKeyword" size="small" placeholder="排序" popper-class="popper" :popper-append-to-body="false">
          <el-option
            v-for="item in sortKeywords"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <el-button :loading="loading" @click.stop="updateEvent" icon="el-icon-refresh">更新推荐</el-button>
    </div>
    <div class="listpage-body" id="recommendations-body" >
      <div class="show-table" id="star-table" v-if="setting.recommendationViewMode === 'table'">
        <el-table size="mini" fit height="100%" row-key="id"
        ref="recommendationsTable"
        :data="filteredRecommendations"
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
          <el-table-column v-if="filteredRecommendations.some(e => e.rate)"
            prop="rate"
            align="center"
            width="100"
            label="豆瓣评分">
          </el-table-column>
          <el-table-column v-if="filteredRecommendations.some(e => e.detail.note)"
            prop="detail.note"
            label="备注">
          </el-table-column>
          <el-table-column
            label="操作"
            header-align="center"
            align="right"
            width="200">
            <template slot-scope="scope">
              <el-button @click.stop="playEvent(scope.row)" type="text">播放</el-button>
              <el-button @click.stop="shareEvent(scope.row)" type="text">分享</el-button>
              <el-button @click.stop="downloadEvent(scope.row)" type="text">下载</el-button>
              <el-button @click.stop="deleteEvent(scope.row)" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="show-picture" id="star-picture" v-if="setting.recommendationViewMode === 'picture'">
        <Waterfall ref="recommendationsWaterfall" :list="filteredRecommendations" :gutter="20" :width="240"
          :breakpoints="{
            1200: { //当屏幕宽度小于等于1200
              rowPerView: 4,
            },
            800: { //当屏幕宽度小于等于800
              rowPerView: 3,
            },
            500: { //当屏幕宽度小于等于500
              rowPerView: 2,
            }
          }"
          animationDuration="0.5s"
          backgroundColor="rgba(0, 0, 0, 0)">
            <template slot="item" slot-scope="props">
              <div class="card">
                <div class="img">
                  <div class="rate" v-if="props.data.rate && props.data.rate !== '暂无评分'">
                    <span>{{props.data.rate}}分</span>
                  </div>
                  <img style="width: 100%" :src="props.data.detail.pic" alt="" @load="$refs.recommendationsWaterfall.refresh()" @click="detailEvent(props.data)">
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
import { history, recommendation, setting } from '../lib/dexie'
import zy from '../lib/site/tools'
import Waterfall from 'vue-waterfall-plugin'
const { clipboard } = require('electron')
export default {
  name: 'recommendations',
  data () {
    return {
      recommendations: [],
      sites: [],
      loading: false,
      types: [],
      selectedTypes: [],
      areas: [],
      selectedAreas: [],
      sortKeyword: '',
      sortKeywords: ['上映', '评分', '默认']
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
    setting: {
      get () {
        return this.$store.getters.getSetting
      },
      set (val) {
        this.SET_SETTING(val)
      }
    },
    filteredRecommendations () {
      var filteredData = this.recommendations.filter(x => (this.selectedAreas.length === 0) || this.selectedAreas.includes(x.detail.area))
      filteredData = filteredData.filter(x => (this.selectedTypes.length === 0) || this.selectedTypes.includes(x.detail.type))
      return filteredData
    }
  },
  watch: {
    view () {
      if (this.view === 'Recommendation') {
        if (this.$refs.recommendationsWaterfall) this.$refs.recommendationsWaterfall.resize()
      }
    },
    sortKeyword () {
      switch (this.sortKeyword) {
        case '上映':
          this.recommendations = this.recommendations.sort(function (a, b) {
            return b.detail.year - a.detail.year
          })
          break
        case '评分':
          this.recommendations.sort(function (a, b) {
            return b.rate - a.rate
          })
          break
        case '默认':
          this.recommendations.sort(function (a, b) {
            return b.id - a.id
          })
          break
        default:
          break
      }
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW', 'SET_DETAIL', 'SET_VIDEO', 'SET_SHARE', 'SET_SETTING']),
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
      const url = 'https://raw.githubusercontent.com/cuiocean/ZY-Player-Resources/main/Recommendations/Recommendations.json'
      this.loading = true
      const axios = require('axios')
      axios.get(url).then(res => {
        if (res.status === 200) {
          if (res.data.length > 0) {
            this.recommendations = res.data
            recommendation.clear().then(recommendation.bulkAdd(this.recommendations))
            this.getFilterData()
            this.$message.success('更新推荐成功. 仅根据作者cuiocean个人喜好推荐,不喜请无视.')
          }
        }
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$message.error('更新推荐失败. ' + error)
        this.$message.warning('最新的推荐数据保存在Github上,请考虑使用代理或者等待下一版本内置数据更新.')
      })
    },
    async playEvent (e) {
      const db = await history.find({ site: e.key, ids: e.ids })
      if (db) {
        this.video = { key: e.key, info: { id: db.ids, name: db.name, index: db.index }, detail: db.detail }
      } else {
        this.video = { key: e.key, info: { id: e.ids, name: e.name, index: 0 }, detail: e.detail }
      }
      this.view = 'Play'
    },
    deleteEvent (e) {
      recommendation.remove(e.id).then(res => {
        if (res) {
          this.$message.warning('删除失败')
        }
        this.getRecommendations()
      })
    },
    shareEvent (e) {
      this.share = {
        show: true,
        key: e.key,
        info: e.detail
      }
    },
    downloadEvent (e) {
      const key = e.key
      const id = e.ids
      zy.download(key, id).then(res => {
        if (res && res.m3u8List) {
          const list = res.m3u8List.split('#')
          let downloadUrl = ''
          for (const i of list) {
            const url = encodeURI(i.split('$')[1])
            downloadUrl += (url + '\n')
          }
          clipboard.writeText(downloadUrl)
          this.$message.success('『MP4』格式的链接已复制, 快去下载吧!')
        } else {
          zy.detail(key, id).then(res => {
            const list = [...res.m3u8List]
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
    getRecommendations () {
      recommendation.all().then(res => {
        this.recommendations = res.sort(function (a, b) {
          return b.id - a.id
        })
        this.getFilterData()
      })
    },
    getFilterData () {
      this.types = [...new Set(this.recommendations.map(ele => ele.detail.type))].filter(x => x)
      this.areas = [...new Set(this.recommendations.map(ele => ele.detail.area))].filter(x => x)
    },
    updateViewMode () {
      setTimeout(() => { if (this.$refs.recommendationsWaterfall) this.$refs.recommendationsWaterfall.refresh() }, 700)
      setting.find().then(res => {
        res.recommendationViewMode = this.setting.recommendationViewMode
        setting.update(res)
      })
    }
  },
  created () {
    this.getRecommendations()
  },
  mounted () {
    addEventListener('resize', () => {
      setTimeout(() => { if (this.$refs.recommendationsWaterfall) this.$refs.recommendationsWaterfall.resize() }, 500)
    })
  }
}
</script>
