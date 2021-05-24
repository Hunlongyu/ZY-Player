<template>
  <div class="listpage" id="sites">
    <div class="listpage-header" v-show="!enableBatchEdit">
          <el-switch v-model="enableBatchEdit" active-text="批处理分组">></el-switch>
          <el-button @click="openFilterKeywordsDiag" icon="el-icon-key">关键词过滤</el-button>
          <el-button @click="addSite" icon="el-icon-document-add">新增</el-button>
          <el-button @click="exportSites" icon="el-icon-upload2" title="导出全部，自动添加扩展名">导出</el-button>
          <el-button @click="importSites" icon="el-icon-download" title="支持同时导入多个文件">导入</el-button>
          <el-button @click="checkAllSite" icon="el-icon-refresh" :loading="checkAllSitesLoading" title="可在后台运行">检测{{ this.checkAllSitesLoading ? this.checkProgress + '/' + this.sites.length : '' }}</el-button>
          <el-button @click="resetSitesEvent" icon="el-icon-refresh-left">重置</el-button>
    </div>
    <div class="listpage-header" v-show="enableBatchEdit">
          <el-switch v-model="enableBatchEdit" active-text="批处理分组"></el-switch>
          <el-input placeholder="新组名" v-model="batchGroupName"></el-input>
          <el-switch v-model="batchIsActive" active-text="启用"></el-switch>
          <el-button type="primary" icon="el-icon-edit" @click.stop="saveBatchEdit" title="输入框组名为空时仅保存开关状态">保存分组与开关状态</el-button>
          <el-button @click="removeSelectedSites" icon="el-icon-delete-solid">删除</el-button>
    </div>
    <div class="listpage-body" id="sites-body">
      <div class="show-table" id="sites-table">
        <el-table size="mini" fit height="100%" row-key="id"
          ref="editSitesTable"
          :data="sites"
          @select="selectionCellClick"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange">
          <el-table-column
            type="selection"
            v-if="enableBatchEdit">
          </el-table-column>
          <el-table-column
            prop="name"
            label="资源名">
          </el-table-column>
          <el-table-column
            prop="isActive"
            width="120"
            :filters = "[{text:'启用', value: true}, {text:'停用', value: false}]"
            :filter-method="(value, row) => value === row.isActive"
            label="启用">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isActive"
                @click.native.stop='propChangeEvent(scope.row)'>
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            prop="reverseOrder"
            width="120"
            label="倒序排列">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.reverseOrder"
                @click.native.stop='propChangeEvent(scope.row)'>>
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            prop="group"
            label="分组"
            :filters="getFilters"
            :filter-method="(value, row) => value === row.group"
            filter-placement="bottom-end">
          </el-table-column>
          <el-table-column
            label="状态"
            sortable
            :sort-by="['status']"
            width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.status === ' '">
                <i class="el-icon-loading"></i>
                检测中...
              </span>
              <span v-else>{{scope.row.status}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            header-align="center"
            align="right"
            :width="sites.every(site => site.status) && !checkAllSitesLoading ? 200 : 150">
            <template slot-scope="scope">
              <el-button size="mini" @click.stop="moveToTopEvent(scope.row)" type="text">置顶</el-button>
              <el-button size="mini" @click.stop="editSite(scope.row)" type="text">编辑</el-button>
              <!-- 检测时先强制批量检测一遍，如果不强制直接单个检测时第一次不会显示“检测中” -->
              <el-button size="mini" v-if="sites.every(site => site.status)" v-show="!checkAllSitesLoading" @click.stop="checkSingleSite(scope.row)" type="text">检测</el-button>
              <el-button size="mini" @click.stop="removeEvent(scope.row)" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
     </div>
    <!-- 编辑页面 -->
    <div>
      <el-dialog :visible.sync="editSiteDialogVisible" v-if='editSiteDialogVisible' :title="dialogType==='edit'?'编辑源':'新增源'" :append-to-body="true" @close="closeDialog">
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
          <el-form-item label="解析接口" prop='jiexiUrl'>
            <el-input v-model="siteInfo.jiexiUrl" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入解析接口地址，默认源自带解析,若要调用应用默认解析接口请输入默认或default"/>
          </el-form-item>
          <el-form-item label="分组" prop='group'>
            <el-select v-model="siteInfo.group" allow-create filterable default-first-option placeholder="请输入分组">
              <el-option v-for="item in siteGroup" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="源站标识" prop='key'>
            <el-input v-model="siteInfo.key" placeholder="请输入源站标识，如果为空，系统则自动生成" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="addOrEditSite">保存</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 设置过滤关键词页面 -->
    <div>
      <el-dialog :visible.sync="filterKeywordsDialogVisible" v-if='filterKeywordsDialogVisible' :title="'分类过滤'" :append-to-body="true" @close="closeDialog">
        <el-form>
          <el-switch v-model="excludeRootClasses" active-text="开启主分类过滤">></el-switch>
          <el-form-item>
            <el-input v-model="rootClassFilterKeywords" :autosize="{ minRows: 3, maxRows: 6}" type="textarea" placeholder="请输入过滤关键词" />
          </el-form-item>
        </el-form>
        <el-form>
          <el-switch v-model="excludeR18Films" active-text="开启福利分类过滤">></el-switch>
          <el-form-item>
            <el-input v-model="r18ClassFilterKeywords" :autosize="{ minRows: 3, maxRows: 6}" type="textarea" placeholder="请输入过滤关键词" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="saveFilterKeywords">保存</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { sites, setting } from '../lib/dexie'
import zy from '../lib/site/tools'
import { remote } from 'electron'
import fs from 'fs'
import Sortable from 'sortablejs'

export default {
  name: 'editSites',
  data () {
    return {
      show: false,
      sites: [],
      dialogType: 'new',
      editSiteDialogVisible: false,
      filterKeywordsDialogVisible: false,
      siteInfo: {
        key: '',
        name: '',
        api: '',
        download: '',
        jiexiUrl: '',
        group: '',
        isActive: true
      },
      excludeRootClasses: true,
      excludeR18Films: true,
      rootClassFilterKeywords: [],
      r18ClassFilterKeywords: [],
      siteGroup: [],
      rules: {
        name: [
          { required: true, message: '源站名不能为空', trigger: 'blur' }
        ],
        api: [
          { required: true, message: 'API地址不能为空', trigger: 'blur' }
        ]
      },
      enableBatchEdit: false,
      batchGroupName: '',
      batchIsActive: true,
      shiftDown: false,
      selectionBegin: '',
      selectionEnd: '',
      multipleSelection: [],
      checkAllSitesLoading: false,
      checkProgress: 0,
      stopFlag: false,
      editOldkey: ''
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
    getFilters () {
      const groups = [...new Set(this.sites.map(site => site.group))]
      const filters = []
      groups.forEach(g => {
        const doc = {
          text: g,
          value: g
        }
        filters.push(doc)
      })
      return filters
    }
  },
  watch: {
    enableBatchEdit () {
      if (this.checkAllSitesLoading) {
        this.$message.info('正在检测, 请勿操作.')
        this.enableBatchEdit = false
      }
      if (this.enableBatchEdit) {
        if (this.setting.shiftTooltipLimitTimes === undefined) this.setting.shiftTooltipLimitTimes = 5
        if (this.setting.shiftTooltipLimitTimes) {
          this.$message.info('多选时支持shift快捷键')
          this.setting.shiftTooltipLimitTimes--
          setting.find().then(res => {
            res.shiftTooltipLimitTimes = this.setting.shiftTooltipLimitTimes
            setting.update(res)
          })
        }
      }
    }
  },
  methods: {
    ...mapMutations(['SET_SETTING']),
    selectionCellClick (selection, row) {
      if (this.shiftDown && this.selectionBegin !== '' && selection.includes(row)) {
        this.selectionEnd = row.id
        const start = this.sites.findIndex(e => e.id === Math.min(this.selectionBegin, this.selectionEnd))
        const end = this.sites.findIndex(e => e.id === Math.max(this.selectionBegin, this.selectionEnd))
        const selections = this.sites.slice(start, end + 1)
        this.$nextTick(() => {
          selections.forEach(e => this.$refs.editSitesTable.toggleRowSelection(e, true))
        })
        this.selectionBegin = this.selectionEnd = ''
        return
      }
      if (selection.includes(row)) {
        this.selectionBegin = row.id
      } else {
        this.selectionBegin = ''
      }
    },
    handleSelectionChange (rows) {
      this.multipleSelection = rows
    },
    handleSortChange (column, prop, order) {
      if (this.checkAllSitesLoading) {
        this.$message.info('正在检测, 请勿操作.')
        return false
      }
      this.updateDatabase(this.sites)
    },
    saveBatchEdit () {
      this.multipleSelection.forEach(ele => {
        if (this.batchGroupName) {
          ele.group = this.batchGroupName
        }
        ele.isActive = this.batchIsActive
      })
      this.updateDatabase()
    },
    getSites () {
      sites.all().then(res => {
        res.forEach(element => {
          if (element.reverseOrder === null || element.reverseOrder === undefined) {
            element.reverseOrder = false
          }
        })
        this.sites = res
      })
    },
    getSitesGroup () {
      const arr = []
      for (const i of this.sites) {
        if (arr.indexOf(i.group) < 0) {
          arr.push(i.group)
        }
      }
      this.siteGroup = arr
    },
    openFilterKeywordsDiag () {
      this.excludeRootClasses = this.setting.excludeRootClasses
      this.excludeR18Films = this.setting.excludeR18Films
      this.rootClassFilterKeywords = this.setting.rootClassFilter?.join()
      this.r18ClassFilterKeywords = this.setting.r18ClassFilter?.join()
      this.filterKeywordsDialogVisible = true
    },
    saveFilterKeywords () {
      // 移除空格,然后按逗号分开
      this.setting.rootClassFilter = this.rootClassFilterKeywords?.replace(/\s/g, '').split(',')
      this.setting.r18ClassFilter = this.r18ClassFilterKeywords?.replace(/\s/g, '').split(',')
      this.setting.classFilter = []
      this.setting.excludeRootClasses = this.excludeRootClasses
      if (this.excludeRootClasses) {
        this.setting.classFilter = this.setting.classFilter.concat(this.setting.rootClassFilter)
      }
      this.setting.excludeR18Films = this.excludeR18Films
      if (this.excludeR18Films) {
        this.setting.classFilter = this.setting.classFilter.concat(this.setting.r18ClassFilter)
      }
      setting.update(this.setting)
      this.filterKeywordsDialogVisible = false
    },
    addSite () {
      if (this.checkAllSitesLoading) {
        this.$message.info('正在检测, 请勿操作.')
        return false
      }
      this.getSitesGroup()
      this.dialogType = 'new'
      this.editSiteDialogVisible = true
      this.siteInfo = {
        key: '',
        name: '',
        api: '',
        download: '',
        jiexiUrl: '',
        group: '',
        isActive: true
      }
    },
    editSite (siteInfo) {
      if (this.checkAllSitesLoading) {
        this.$message.info('正在检测, 请勿操作.')
        return false
      }
      this.getSitesGroup()
      this.dialogType = 'edit'
      this.editSiteDialogVisible = true
      this.siteInfo = siteInfo
      this.editOldkey = siteInfo.key
    },
    closeDialog () {
      this.editSiteDialogVisible = false
      this.filterKeywordsDialogVisible = false
      this.getSites()
    },
    removeEvent (e) {
      if (this.checkAllSitesLoading) {
        this.$message.info('正在检测, 请勿操作.')
        return false
      }
      sites.remove(e.id).then(res => {
        this.getSites()
      }).catch(err => {
        this.$message.warning('删除源失败, 错误信息: ' + err)
      })
    },
    checkSiteKey (e) {
      if (this.dialogType === 'edit' && this.editOldkey === this.siteInfo.key) {
        return true
      } else {
        for (const i of this.sites) {
          if (i.key === this.siteInfo.key) {
            this.$message.warning(`源站标识: ${i.key} 已存在, 请勿重复填写.`)
            return false
          }
        }
        return true
      }
    },
    addOrEditSite () {
      if (!this.siteInfo.name || !this.siteInfo.api) {
        this.$message.error('名称和API接口不能为空。')
        return false
      }
      if (!this.checkSiteKey()) {
        return false
      }
      const randomstring = require('randomstring')
      const doc = {
        key: this.dialogType === 'edit' ? this.siteInfo.key : this.siteInfo.key ? this.siteInfo.key : randomstring.generate(6),
        id: this.dialogType === 'edit' ? this.siteInfo.id : this.sites.length ? this.sites[this.sites.length - 1].id + 1 : 1,
        name: this.siteInfo.name,
        api: this.siteInfo.api,
        download: this.siteInfo.download,
        jiexiUrl: this.siteInfo.jiexiUrl,
        group: this.siteInfo.group,
        isActive: this.siteInfo.isActive
      }
      if (this.dialogType === 'edit') sites.remove(this.siteInfo.id)
      sites.add(doc).then(res => {
        this.siteInfo = {
          key: '',
          name: '',
          api: '',
          download: '',
          jiexiUrl: '',
          group: ''
        }
        this.dialogType === 'edit' ? this.$message.success('修改成功！') : this.$message.success('新增源成功！')
        this.editSiteDialogVisible = false
        this.getSites()
      })
      this.editOldkey = ''
    },
    exportSites () {
      this.getSites()
      const arr = [...this.sites]
      const str = JSON.stringify(arr, null, 2)
      const options = {
        filters: [
          { name: 'JSON file', extensions: ['json'] }
        ]
      }
      remote.dialog.showSaveDialog(options).then(result => {
        if (!result.canceled) {
          if (!result.filePath.endsWith('.json')) result.filePath += '.json'
          fs.writeFileSync(result.filePath, str)
          this.$message.success('已保存成功')
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    importSites () {
      if (this.checkAllSitesLoading) {
        this.$message.info('正在检测, 请勿操作.')
        return false
      }
      const options = {
        filters: [
          { name: '支持的文件格式', extensions: ['json', 'txt'] }
        ],
        properties: ['openFile', 'multiSelections']
      }
      remote.dialog.showOpenDialog(options).then(result => {
        if (!result.canceled) {
          result.filePaths.forEach(file => {
            if (file.endsWith('json')) {
              const str = fs.readFileSync(file)
              const json = JSON.parse(str)
              json.forEach(ele => {
                if (ele.api && this.sites.filter(x => x.key === ele.key).length === 0 && this.sites.filter(x => x.name === ele.name && x.api === ele.api).length === 0) {
                  // 不含该key 同时也不含名字和url一样的
                  if (ele.isActive === undefined) {
                    ele.isActive = true
                  }
                  if (ele.group === undefined) {
                    ele.group = '导入'
                  }
                  this.sites.push(ele)
                }
              })
              this.resetId(this.sites)
              sites.clear().then(sites.bulkAdd(this.sites))
              this.$message.success('导入成功')
              this.getSites()
            }
            if (file.endsWith('txt')) {
              try {
                const txt = fs.readFileSync(file, 'utf8')
                const json = JSON.parse(txt)
                json.forEach(ele => {
                  if (ele.api && this.sites.filter(x => x.key === ele.key).length === 0 && this.sites.filter(x => x.name === ele.name && x.api === ele.api).length === 0) {
                    // 不含该key 同时也不含名字和url一样的
                    if (ele.isActive === undefined) {
                      ele.isActive = true
                    }
                    if (ele.group === undefined) {
                      ele.group = '导入'
                    }
                    this.sites.push(ele)
                  }
                })
                this.resetId(this.sites)
                sites.clear().then(sites.bulkAdd(this.sites))
                this.$message.success('导入成功')
                this.getSites()
              } catch (error) {
                this.$message.warning('导入失败')
              }
            }
          })
        }
      })
    },
    resetSitesEvent () {
      let url = this.setting.sitesDataURL
      if (!url) {
        // 如果没有设置源站文件链接,使用默认的gitee源
        url = 'https://gitee.com/cuiocean/ZY-Player-Resources/raw/main/Sites/Sites.json'
      }
      zy.getDefaultSites(url).then(res => {
        if (res.length > 0) {
          sites.clear().then(sites.bulkAdd(res))
          this.$message.success('重置源成功')
          this.getSites()
        }
      }).catch(error => {
        this.$message.error('导入云端源站失败. ' + error)
      })
    },
    moveToTopEvent (i) {
      if (this.checkAllSitesLoading) {
        this.$message.info('正在检测, 请勿操作.')
        return false
      }
      this.sites.sort(function (x, y) { return x.key === i.key ? -1 : y.key === i.key ? 1 : 0 })
      this.updateDatabase()
    },
    syncTableData () {
      if (this.$refs.editSitesTable.tableData && this.$refs.editSitesTable.tableData.length === this.sites.length) {
        this.sites = this.$refs.editSitesTable.tableData
      }
    },
    propChangeEvent (row) {
      sites.remove(row.id)
      sites.add(row)
      this.getSites()
    },
    resetId (inArray) {
      let id = 1
      inArray.forEach(ele => {
        ele.id = id
        id += 1
      })
    },
    updateDatabase () {
      // 因为el-table的数据是单向绑定,我们先同步el-table里的数据和其绑定的数据
      this.syncTableData()
      sites.clear().then(res => {
        let id = 1
        this.sites.forEach(ele => {
          ele.id = id
          id += 1
        })
        sites.bulkAdd(this.sites).then(this.getSites())
      })
    },
    removeSelectedSites () {
      this.multipleSelection.forEach(e => sites.remove(e.id))
      this.$refs.editSitesTable.clearFilter()
      this.getSites()
      this.updateDatabase()
      this.enableBatchEdit = false
    },
    rowDrop () {
      if (this.checkAllSitesLoading) {
        this.$message.info('正在检测, 请勿操作.')
        return false
      }
      const tbody = document.getElementById('sites-table').querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd ({ newIndex, oldIndex }) {
          const currRow = _this.sites.splice(oldIndex, 1)[0]
          _this.sites.splice(newIndex, 0, currRow)
          _this.updateDatabase()
        }
      })
    },
    async checkAllSite () {
      if (this.checkAllSitesLoading) return
      this.checkAllSitesLoading = true
      this.stopFlag = false
      this.checkProgress = 0
      const uncheckedList = this.sites.filter(e => e.status === undefined || e.status === ' ') // 未检测过的优先
      const other = this.sites.filter(e => !uncheckedList.includes(e))
      await Promise.all(uncheckedList.map(site => this.checkSingleSite(site)))
      await Promise.all(other.map(site => this.checkSingleSite(site))).then(res => {
        this.checkAllSitesLoading = false
        this.getSites()
        if (!this.stopFlag) this.$message.success('视频点播源站批量检测已完成！')
      })
    },
    async checkSingleSite (row) {
      row.status = ' '
      if (this.stopFlag) {
        this.checkProgress += 1
        return row.status
      }
      const flag = await zy.check(row.key)
      this.checkProgress += 1
      if (flag) {
        row.status = '可用'
      } else {
        row.status = '失效'
        row.isActive = false
      }
      sites.remove(row.id)
      sites.add(row)
      return row.status
    }
  },
  mounted () {
    this.rowDrop()
    addEventListener('keydown', code => { if (code.keyCode === 16) this.shiftDown = true })
    addEventListener('keyup', code => { if (code.keyCode === 16) this.shiftDown = false })
  },
  created () {
    this.getSites()
  }
}
</script>
