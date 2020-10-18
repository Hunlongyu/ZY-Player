<template>
  <div class="listpage" id="editSites">
    <div class="listpage-content">
      <div class="listpage-header">
        <span class="btn" @click="addSite">添加</span>
        <span class="btn" @click="exportSites">导出</span>
        <span class="btn" @click="importSites">导入</span>
        <span class="btn" @click="removeAllSites">清空</span>
        <span class="btn" @click="resetSitesEvent">重置</span>
      </div>
      <div class="listpage-body" id="sites-table">
        <el-table
              :data="sites"
              row-key="id"
              style="width: 100%">
              <el-table-column
                prop="name"
                label="资源名"
                min-width="200">
              </el-table-column>
              <el-table-column
                label="操作"
                header-align="center"
                align="right"
                width="140">
                <template slot-scope="scope">
                  <el-button @click.stop="moveSiteToTop(scope.row)" type="text">置顶</el-button>
                  <el-button @click.stop="editSite(scope.row)" type="text">编辑</el-button>
                  <el-button @click.stop="removeEvent(scope.row)" type="text">删除</el-button>
                </template>
              </el-table-column>
        </el-table>
    </div>
    <!-- 编辑页面 -->
    <div>
        <el-dialog :visible.sync="dialogVisible" v-if='dialogVisible' :title="dialogType==='edit'?'编辑源':'添加源'" :append-to-body="true" @close="closeDialog">
          <el-form :model="siteInfo" ref='siteInfo' label-width="75px" label-position="left" :rules="rules">
              <el-form-item label="源站名" prop='name'>
                  <el-input v-model="siteInfo.name" placeholder="请输入源站名" />
              </el-form-item>
              <el-form-item label="API接口" prop='api'>
                  <el-input v-model="siteInfo.api" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入API接口地址"/>
              </el-form-item>
              <el-form-item label="下载接口" prop='download'>
                  <el-input v-model="siteInfo.download" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入Download接口地址，可以空着"/>
              </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
             <el-button @click="closeDialog">取消</el-button>
             <el-button type="primary" @click="addOrEditSite">保存</el-button>
          </span>
        </el-dialog>
    </div>
   </div>

  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { sites } from '../lib/dexie'
import { remote } from 'electron'
import { sites as defaultSites } from '../lib/dexie/initData'
import fs from 'fs'
import Vue from 'vue'
import ElementUI from 'element-ui'
import Sortable from 'sortablejs'
Vue.use(ElementUI)

export default {
  name: 'editSites',
  data () {
    return {
      show: false,
      sites: [],
      dialogType: 'new',
      dialogVisible: false,
      siteInfo: {
        name: '',
        api: '',
        download: ''
      },
      rules: {
        name: [
          { required: true, message: '源站名不能为空', trigger: 'blur' }
        ],
        api: [
          { required: true, message: 'API地址不能为空', trigger: 'blur' }
        ],
        download: [
          { required: false, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    setting: {
      get () {
        return this.$store.getters.getSetting
      },
      set (val) {
        this.SET_SETTING(val)
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
    ...mapMutations(['SET_SETTING', 'SET_EDITSITES']),
    getSites () {
      sites.all().then(res => {
        this.sites = res
      })
      this.editSites = {
        sites: this.sites
      }
    },
    addSite () {
      this.dialogType = 'new'
      this.dialogVisible = true
      this.siteInfo = {
        name: '',
        api: '',
        download: ''
      }
    },
    editSite (siteInfo) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.siteInfo = siteInfo
    },
    closeDialog () {
      this.dialogVisible = false
      this.getSites()
    },
    removeEvent (e) {
      sites.remove(e.id).then(res => {
        this.getSites()
      }).catch(err => {
        this.$message.warning('删除源失败, 错误信息: ' + err)
      })
    },
    listUpdatedEvent () {
      sites.clear().then(res1 => {
        // 重新排序
        var id = 1
        this.sites.forEach(element => {
          element.id = id
          sites.add(element)
          id += 1
        })
      })
    },
    addOrEditSite () {
      if (!this.siteInfo.name || !this.siteInfo.api) {
        this.$message.error('名称和API接口不能为空。')
        return
      }
      var randomstring = require('randomstring')
      var doc = {
        key: this.dialogType === 'edit' ? this.siteInfo.key : randomstring.generate(6),
        id: this.dialogType === 'edit' ? this.siteInfo.id : this.sites[this.sites.length - 1].id + 1,
        name: this.siteInfo.name,
        api: this.siteInfo.api,
        download: this.siteInfo.download
      }
      if (this.dialogType === 'edit') sites.remove(this.siteInfo.id)
      sites.add(doc).then(res => {
        this.siteInfo = {
          name: '',
          api: '',
          download: ''
        }
        this.dialogType === 'edit' ? this.$message.success('修改成功！') : this.$message.success('添加新源成功！')
        this.dialogVisible = false
        this.getSites()
      })
    },
    exportSites () {
      this.getSites()
      const arr = [...this.sites]
      const str = JSON.stringify(arr, null, 4)
      const options = {
        filters: [
          { name: 'JSON file', extensions: ['json'] },
          { name: 'Normal text file', extensions: ['txt'] },
          { name: 'All types', extensions: ['*'] }
        ]
      }
      remote.dialog.showSaveDialog(options).then(result => {
        if (!result.canceled) {
          fs.writeFileSync(result.filePath, str)
          this.$message.success('已保存成功')
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    importSites () {
      const options = {
        filters: [
          { name: 'JSON file', extensions: ['json'] },
          { name: 'Normal text file', extensions: ['txt'] },
          { name: 'All types', extensions: ['*'] }
        ],
        properties: ['openFile', 'multiSelections']
      }
      remote.dialog.showOpenDialog(options).then(result => {
        if (!result.canceled) {
          result.filePaths.forEach(file => {
            var str = fs.readFileSync(file)
            const json = JSON.parse(str)
            json.forEach(ele => {
              if (this.sites.filter(x => x.key === ele.key).length === 0 && this.sites.filter(x => x.name === ele.name && x.url === ele.url).length === 0) {
                // 不含该key 同时也不含名字和url一样的
                this.sites.push(ele)
              }
            })
            this.resetId(this.sites)
            sites.clear().then(sites.bulkAdd(this.sites))
            this.$message.success('导入成功')
          })
        }
      })
    },
    resetSitesEvent () {
      sites.clear().then(sites.bulkAdd(defaultSites).then(this.getSites()))
      this.$message.success('重置源成功')
    },
    moveSiteToTop (i) {
      this.sites.sort(function (x, y) { return x.key === i.key ? -1 : y.key === i.key ? 1 : 0 })
      this.updateDatabase(this.sites)
    },
    resetId (inArray) {
      var id = 1
      inArray.forEach(ele => {
        ele.id = id
        id += 1
      })
    },
    updateDatabase (data) {
      sites.clear().then(res => {
        var id = 1
        data.forEach(ele => {
          ele.id = id
          id += 1
        })
        sites.bulkAdd(data).then(this.getSites())
      })
    },
    removeAllSites () {
      sites.clear().then(this.getSites())
    },
    rowDrop () {
      const tbody = document.getElementById('sites-table').querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd ({ newIndex, oldIndex }) {
          const currRow = _this.sites.splice(oldIndex, 1)[0]
          _this.sites.splice(newIndex, 0, currRow)
          _this.updateDatabase(_this.sites)
        }
      })
    }
  },
  mounted () {
    this.rowDrop()
  },
  created () {
    this.getSites()
  }
}
</script>
