<template>
  <div class="listpage" id="editSites">
    <div class="listpage-content">
      <div class="listpage-header">
        <el-button @click.stop="addSite" type="text">添加</el-button>
        <el-button @click.stop="editGroupDialogVisible = true" type="text">分组管理</el-button>
        <el-button @click.stop="batchSetDialogVisible = multipleSelection.length" type="text">指定分组</el-button>
        <el-button @click.stop="exportSites" type="text">导出</el-button>
        <el-button @click.stop="importSites" type="text">导入</el-button>
        <el-button @click.stop="removeAllSites" type="text">清空</el-button>
        <el-button @click.stop="resetSitesEvent" type="text">重置</el-button>
      </div>
      <div class="listpage-body" id="sites-table">
        <el-table @selection-change="handleSelectionChange"
              :data="sites"
              row-key="id"
              style="width: 100%">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="name"
                label="资源名"
                min-width="150">
              </el-table-column>
              <el-table-column
                prop="gid"
                :formatter="getGroupName"
                label="所在组"
                width="150">
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
              <el-form-item label="所在组" prop='gid'>
                <el-select v-model="siteInfo.gid"  placeholder="请选择">
                  <el-option default-first-option
                    v-for="item in groups"
                    :key="item.gid"
                    :label="item.name"
                    :value="item.gid">
                  </el-option>
                </el-select>
              </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
             <el-button @click="closeDialog">取消</el-button>
             <el-button type="primary" @click="addOrEditSite">保存</el-button>
          </span>
        </el-dialog>
    </div>
    <!-- 分组管理 -->
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
              width="150">
              <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.name" placeholder="请输入组名" ></el-input>
              </template>
          </el-table-column>
          <el-table-column
              prop="doubanRate"
              label="豆瓣评分"
              align="center">
              <template slot-scope="scope">
                <el-switch
                    v-model="scope.row.doubanRate"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                  </el-switch>
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
   <!-- 指定分组 -->
   <div>
     <el-dialog :visible.sync="batchSetDialogVisible" v-if='batchSetDialogVisible' title="指定分组" :append-to-body="true" @close="closeDialog">
       <el-select v-model="batchConfigGroup" placeholder="请选择">
         <el-option
           v-for="item in groups"
           :key="item.gid"
           :label="item.name"
           :value="item.gid">
         </el-option>
       </el-select>
       <span slot="footer" class="dialog-footer">
         <el-button @click="closeDialog">取消</el-button>
         <el-button type="primary" @click="batchSet">保存</el-button>
       </span>
     </el-dialog>
   </div>
 </div>
</div>
</template>
<script>
import { mapMutations } from 'vuex'
import { sites, groups } from '../lib/dexie'
import { remote } from 'electron'
import { sites as defaultSites, groups as defaultGroups } from '../lib/dexie/initData'
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
      editGroupDialogVisible: false,
      batchSetDialogVisible: false,
      batchConfigGroup: 0,
      tempGroups: [],
      groups: [],
      siteInfo: {
        name: '',
        api: '',
        gid: 0,
        download: ''
      },
      multipleSelection: [],
      rules: {
        name: [
          { required: true, message: '源站名不能为空', trigger: 'blur' }
        ],
        api: [
          { required: true, message: 'API地址不能为空', trigger: 'blur' }
        ],
        gid: [
          { required: true, message: '请选择分组', trigger: 'blur' }
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
    close () {
      this.editSites.show = false
    },
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
        gid: 0,
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
      this.batchSetDialogVisible = false
      this.editGroupDialogVisible = false
      this.tempGroups = []
      this.getSites()
      this.getGroups()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    getGroupName (row, column) {
      const gid = row[column.property]
      return this.groups[gid].name || gid
    },
    getGroups () {
      groups.all().then(res => {
        this.groups = res
      })
    },
    addGroup () {
      if (!this.tempGroups.length) this.tempGroups = [...this.groups]
      var newGroup = {
        gid: Math.max.apply(null, this.groups.map(g => g.gid)) + 1,
        name: '',
        doubanRate: true
      }
      this.groups.push(newGroup)
    },
    removeGroup (group) {
      if (!this.tempGroups.length) this.tempGroups = [...this.groups]
      const index = this.groups.indexOf(group)
      this.groups.splice(index, 1)
    },
    updateGroups () {
      const gids = this.groups.map(group => group.gid)
      this.sites = this.sites.filter(site => gids.includes(site.gid))
      sites.clear()
      this.sites.forEach(site => sites.add(site))
      groups.clear()
      // groups.add({ gid: 0, name: '待设定'})
      this.groups.forEach(group => groups.add(group))
      this.editGroupDialogVisible = false
      this.tempGroups = []
      this.getSites()
      this.getGroups()
      this.$message.success('调整分组相关操作已完成！')
    },
    batchSet () {
      this.multipleSelection.forEach(site => {
        sites.remove(site.id)
        site.gid = this.batchConfigGroup
        sites.add(site)
      })
      this.batchSetDialogVisible = false
      this.batchSetGroup = 0
      this.$message.success('批量设置完成！')
      this.getSites()
    },
    removeEvent (e) {
      sites.remove(e.id).then(res => {
        this.getSites()
      }).catch(err => {
        this.$message.warning('删除源失败, 错误信息: ' + err)
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
        gid: this.dialogType === 'edit' ? this.siteInfo.gid : 0,
        name: this.siteInfo.name,
        api: this.siteInfo.api,
        download: this.siteInfo.download
      }
      if (this.dialogType === 'edit') sites.remove(this.siteInfo.id)
      sites.add(doc).then(res => {
        this.siteInfo = {
          name: '',
          api: '',
          gid: 0,
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
      groups.clear().then(groups.bulkAdd(defaultGroups).then(this.getGroups()))
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
    this.getGroups()
  }
}
</script>
