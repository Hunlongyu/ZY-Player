<template>
  <div class="detail">
    <div class="detail-content">
      <div class="detail-header">
        <div class="zy-select">
            <div class="vs-placeholder vs-noAfter" @click="addSite">添加新源</div>
        </div>
        <div class="zy-select">
            <div class="vs-placeholder vs-noAfter" @click="editGroupDialogVisible = true">分组管理</div>
        </div>
        <div class="zy-select">
            <div class="vs-placeholder vs-noAfter" @click="batchDialogVisible = Boolean(multipleSelection.length)">批量设置</div>
        </div>
        <div class="zy-select">
          <div class="vs-placeholder vs-noAfter" @click="exportSites">导出</div>
        </div>
        <div class="zy-select">
          <div class="vs-placeholder vs-noAfter" @click="importSites">导入</div>
        </div>
        <div class="zy-select">
          <div class="vs-placeholder vs-noAfter" @click="resetSites">重置</div>
        </div>
        <span class="detail-close zy-svg" @click="close">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="closeIconTitle">
            <title id="closeIconTitle">关闭</title>
            <path d="M6.34314575 6.34314575L17.6568542 17.6568542M6.34314575 17.6568542L17.6568542 6.34314575"></path>
          </svg>
        </span>
      </div>
      <div>
        <el-dialog :visible.sync="editGroupDialogVisible" v-if='editGroupDialogVisible' title="分组管理" :append-to-body="true" @close="closeDialog">
          <el-button
            size="small"
            type="success"
            @click="addGroup">新增组</el-button>
         <el-table
            :data="groups"
            row-key="gid"
            tyle="width: 100%">
            <el-table-column
                prop="gid"
                label="gid"
                width="60">
            </el-table-column>
            <el-table-column
                prop="name"
                label="组名"
                align="center"
                width="250">
                <template slot-scope="scope">
                    <el-input size="small" v-model="scope.row.name" placeholder="请输入组名" ></el-input>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="250">
                <template slot-scope="scope">
                  <el-button @click="removeGroup(scope.row)" type="danger">删除组及属于该组的源</el-button>
                </template>
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
             <el-button @click="closeDialog">取消</el-button>
             <el-button type="primary" @click="updateGroups">确认</el-button>
        </span>
       </el-dialog>
      </div>
      <div>
        <el-dialog :visible.sync="batchDialogVisible" v-if='batchDialogVisible' title="批量设置" :append-to-body="true" @close="closeDialog">
          <el-form :model="batchConfig" label-width="75px" label-position="left">
              <el-form-item   prop='group'>
                  <el-checkbox v-model="setGroupFlag" label="选择分组" />
                  <el-select v-model="batchConfig.group" :disabled="!setGroupFlag" placeholder="请选择">
                    <el-option
                      v-for="item in groups"
                      :key="item.gid"
                      :label="item.name"
                      :value="item.gid">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item  prop='doubanRate'>
                 <el-checkbox  v-model="setDoubanFlag" label="豆瓣评分" />
                  <el-switch :disabled="!setDoubanFlag"
                    v-model="batchConfig.doubanRate"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                  </el-switch>
              </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
             <el-button @click="closeDialog">取消</el-button>
             <el-button type="primary" @click="batchSet">保存</el-button>
          </span>
        </el-dialog>
      </div>
      <div>
        <el-dialog :visible.sync="dialogVisible" v-if='dialogVisible' :title="dialogType==='edit'?'编辑源':'添加新源'" :append-to-body="true" @close="closeDialog">
          <el-form :model="siteInfo" label-width="75px" label-position="left" :rules="rules">
              <el-form-item label="源站名" prop='name'>
                  <el-input v-model="siteInfo.name" placeholder="请输入源站名" />
              </el-form-item>
              <el-form-item label="API接口" prop='api'>
                  <el-input v-model="siteInfo.api" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入API接口地址"/>
              </el-form-item>
              <el-form-item label="下载接口" prop='download'>
                  <el-input v-model="siteInfo.download" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入Download接口地址，可以空着"/>
              </el-form-item>
              <el-form-item label="所属组" prop='group'>
                 <el-select v-model="siteInfo.group"  placeholder="请选择">
                    <el-option default-first-option
                      v-for="item in groups"
                      :key="item.gid"
                      :label="item.name"
                      :value="item.gid">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="豆瓣评分" prop='doubanRate'>
                  <el-switch
                    v-model="siteInfo.doubanRate"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                  </el-switch>
              </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
             <el-button @click="closeDialog">取消</el-button>
             <el-button type="primary" @click="addOrEditSite">确定</el-button>
          </span>
        </el-dialog>
      </div>
      <div class="detail-body zy-scroll">
        <div class="zy-table">
          <div class="tBody zy-scroll" >
            <el-table  @selection-change="handleSelectionChange"
              :data="sites"
              empty-text="  "
              row-key="id"
              style="width: 100%">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="name"
                label="源站名"
                width="200">
              </el-table-column>
              <el-table-column
                prop="group"
                label="所属组"
                header-align="center"
                width="200">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.group" placeholder="请选择" @change="changeSite(scope.row)">
                    <el-option
                      v-for="item in groups"
                      :key="item.gid"
                      :label="item.name"
                      :value="item.gid">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                prop="doubanRate"
                label="豆瓣评分"
                align="center"
                width="100">
                <template slot-scope="scope">
                  <el-switch @change="changeSite(scope.row)"
                    v-model="scope.row.doubanRate"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                align="center"
                width="150">
                <template slot-scope="scope">
                  <el-button @click="moveSiteToTop(scope.row)" type="text">置顶</el-button>
                  <el-button @click="editSite(scope.row)" type="text">编辑</el-button>
                  <el-button @click="removeSite(scope.row)" type="text">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { sites, setting, groups } from '../lib/dexie'
import { remote } from 'electron'
import { sites as defaultSites, groups as defaultGroups } from '../lib/dexie/initData'
import Sortable from 'sortablejs'
import fs from 'fs'
import Vue from 'vue'
import ElementUI from 'element-ui'
Vue.use(ElementUI)

export default {
  name: 'editSites',
  data () {
    return {
      show: false,
      sites: [],
      dialogType: 'new',
      dialogVisible: false,
      batchDialogVisible: false,
      editGroupDialogVisible: false,
      setGroupFlag: true,
      setDoubanFlag: true,
      siteInfo: {
        name: '',
        group: '',
        doubanRate: '',
        api: '',
        download: ''
      },
      tempGroups: [],
      groups: [],
      batchConfig: {
        group: '',
        doubanRate: ''
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
      },
      multipleSelection: []
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
    close () {
      this.editSites.show = false
    },
    closeDialog () {
      this.dialogVisible = false
      this.batchDialogVisible = false
      this.editGroupDialogVisible = false
      if (this.tempGroups.length) this.groups = [...this.tempGroups]
      this.tempGroups = []
      this.getSites()
      this.getGroups()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    addGroup () {
      if (!this.tempGroups.length) this.tempGroups = [...this.groups]
      var newGroup = {
        gid: Math.max.apply(null, this.groups.map(g => g.gid)) + 1,
        name: ''
      }
      this.groups.push(newGroup)
    },
    removeGroup (group) {
      if (!this.tempGroups.length) this.tempGroups = [...this.groups]
      const index = this.tempGroups.indexOf(group)
      this.groups.splice(index, 1)
    },
    updateGroups () {
      const gids = this.groups.map(group => group.gid)
      this.sites = this.sites.filter(site => gids.includes(site.group))
      sites.clear()
      this.sites.forEach(site => sites.add(site))
      groups.clear()
      this.groups.forEach(group => groups.add(group))
      this.editGroupDialogVisible = false
      this.tempGroups = []
      this.$message.success('调整分组相关操作已完成！')
    },
    batchSet () {
      this.multipleSelection.forEach(site => {
        sites.remove(site.id)
        if (this.setGroupFlag) site.group = this.batchConfig.group
        if (this.setDoubanFlag) site.doubanRate = this.batchConfig.doubanRate
        sites.add(site)
      })
      this.batchDialogVisible = false
      this.$message.success('批量设置完成！')
      this.getSites()
    },
    changeSite (site) {
      sites.remove(site.id)
      sites.add(site)
    },
    getSites () {
      sites.all().then(res => {
        res.forEach(site => { if (site.group === undefined) site.group = 0; if (site.doubanRate === undefined) site.doubanRate = true })
        this.sites = res
      })
    },
    getGroups () {
      groups.all().then(res => {
        this.groups = res
      })
    },
    addSite () {
      this.dialogType = 'new'
      this.dialogVisible = true
      this.siteInfo = {
        name: '',
        group: '',
        doubanRate: '',
        api: '',
        download: ''
      }
    },
    editSite (siteInfo) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.siteInfo = siteInfo
    },
    removeSite (site) {
      sites.remove(site.id).then(res => {
        this.getSites()
      }).catch(err => {
        this.$message.warning('删除源失败, 错误信息: ' + err)
      })
    },
    resetAllSitesId (arr) {
      sites.clear().then(res => {
        var id = 1
        arr.forEach(element => {
          element.id = id
          sites.add(element)
          id += 1
        })
      })
    },
    moveSiteToTop (site) {
      this.sites.splice(site.id - 1, 1)
      this.sites.splice(0, 0, site)
      this.resetAllSitesId(this.sites)
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
        group: this.siteInfo.group,
        doubanRate: this.siteInfo.doubanRate,
        api: this.siteInfo.api,
        download: this.siteInfo.download
      }
      if (this.dialogType === 'edit') sites.remove(this.siteInfo.id)
      sites.add(doc).then(res => {
        this.siteInfo = {
          name: '',
          group: '',
          doubanRate: '',
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
        properties: ['openFile']
      }
      remote.dialog.showOpenDialog(options).then(result => {
        if (!result.canceled) {
          sites.clear()
          result.filePaths.forEach(file => {
            var str = fs.readFileSync(file)
            const json = JSON.parse(str)
            sites.bulkAdd(json).then(e => {
              this.getSites()
              this.d.site = json[0].key
              setting.update(this.d).then(res => {
                this.setting = this.d
              })
            })
            this.$message.success('导入成功')
          }).catch(err => {
            this.$message.error(err)
          })
        }
      })
    },
    resetSites () {
      sites.clear()
      sites.bulkAdd(defaultSites).then(e => {
        this.getSites()
      })
      groups.clear()
      groups.bulkAdd(defaultGroups).then(e => {
        this.getGroups()
      })
      this.$message.success('重置源成功')
    },
    rowDrop () {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd ({ newIndex, oldIndex }) {
          const currRow = _this.sites.splice(oldIndex, 1)[0]
          _this.sites.splice(newIndex, 0, currRow)
          _this.resetAllSitesId(_this.sites)
        }
      })
    }
  },
  mounted () {
    this.rowDrop()
  },
  created () {
    this.getSites()
    this.getGroups()
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
  .detail-body{
    height: calc(100% - 50px);
    overflow-y: auto;
  }
}
</style>
