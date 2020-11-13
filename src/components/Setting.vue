<template>
  <div class="setting">
    <div class="setting-box zy-scroll">
      <div class="logo"><img src="@/assets/image/logo.png" alt=""></div>
      <div class="info">
        <a @click="linkOpen('http://zyplayer.fun/')">官网</a>
        <a @click="linkOpen('https://github.com/Hunlongyu/ZY-Player')">Github</a>
        <a @click="linkOpen('https://github.com/Hunlongyu/ZY-Player/issues')">当前版本v{{pkg.version}} 反馈</a>
        <a style="color:#38dd77" @click="quitAndInstall()" v-show="latestVersion !== pkg.version" >最新版本v{{latestVersion}}</a>
      </div>
      <div class="view">
        <div class="title">视图</div>
        <div class="view-box">
          <div class="zy-select" @mouseleave="show.view = false">
            <div class="vs-placeholder" @click="show.view = true">默认视图</div>
            <div class="vs-options" v-show="show.view">
              <ul class="zy-scroll">
                <li :class="d.view === 'picture' ? 'active' : ''" @click="changeView('picture')">海报</li>
                <li :class="d.view === 'table' ? 'active' : ''" @click="changeView('table')">列表</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="shortcut">
        <div class="title">快捷键</div>
        <div class="shortcut-box">
          <div class="zy-select" @mouseleave="show.shortcut = false">
            <div class="vs-placeholder" @click="show.shortcut = true">快捷键</div>
            <div class="vs-options" v-show="show.shortcut">
              <ul class="zy-scroll">
                <li :class="d.shortcut === true ? 'active' : ''" @click="changeShortcut(true)">开启</li>
                <li :class="d.shortcut === false ? 'active' : ''" @click="changeShortcut(false)">关闭</li>
              </ul>
            </div>
          </div>
          <div class="zy-select">
            <div class="vs-placeholder vs-noAfter" @click="expShortcut">导出</div>
          </div>
          <div class="zy-select">
            <div class="vs-placeholder vs-noAfter" @click="impShortcut">导入</div>
          </div>
        </div>
      </div>
      <div class="shortcut">
        <div class="title">缓存</div>
        <div class="shortcut-box">
          <div class="zy-select">
            <div class="vs-placeholder vs-noAfter" @click="clearCache">清理视频缓存</div>
          </div>
        </div>
      </div>
      <div class="site">
        <div class="title">定位时间设置</div>
        <div class="zy-input">
          左/右方向键:<input style="width:50px" type="number" v-model = "d.forwardTimeInSec" @change="updateSettingEvent">秒
        </div>
      </div>
      <div class='site'>
         <div class="title">第三方播放</div>
         <div class="site-box">
            <div class="zy-select">
              <div class="vs-placeholder vs-noAfter" @click="selectLocalPlayer">选择本地播放器</div>
            </div>
            <div class="zy-select" @click = "show.editPlayerPath = true">
              <div class="vs-placeholder vs-noAfter" v-show = "show.editPlayerPath == false">
                <label>编辑</label>
              </div>
              <input class="zy-input" v-show = "show.editPlayerPath == true" v-model = "d.externalPlayer"
                @blur= "updateSettingEvent"
                @keyup.enter = "updateSettingEvent">
            </div>
          </div>
      </div>
      <div class="site">
        <div class="title">源管理</div>
        <div class="site-box">
          <div class="zy-select">
            <div class="vs-placeholder vs-noAfter" @click="editSitesEvent">编辑源</div>
          </div>
          <div class="zy-input" @click="toggleExcludeRootClasses">
           <input type="checkbox" v-model = "d.excludeRootClasses" @change="updateSettingEvent"> 屏蔽主分类
          </div>
        </div>
      </div>
      <div class="site">
        <div class="title">网络</div>
        <div class="site-box">
          <div class="zy-select" @mouseleave="show.proxy = false">
            <div class="vs-placeholder" @click="show.proxy = true">代理设置</div>
            <div class="vs-options" v-show="show.proxy">
              <ul class="zy-scroll">
                <li :class="d.proxy.type === 'none' ? 'active' : ''" @click="changeProxyType('none')">不使用代理</li>
                <!-- <li :class="d.proxy.type === 'system' ? 'active' : ''" @click="changeProxyType('system')">使用系统代理</li> -->
                <li :class="d.proxy.type === 'manual' ? 'active' : ''" @click="changeProxyType('manual')">手动指定代理</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="theme">
        <div class="title">主题</div>
        <div class="theme-box">
          <div @click="changeTheme('light')" class="theme-item light">
            <div class="theme-image">
              <img src="../assets/image/light.png" alt="">
            </div>
            <div class="theme-name">Light</div>
          </div>
          <div @click="changeTheme('dark')" class="theme-item dark">
            <div class="theme-image">
              <img src="../assets/image/dark.png" alt="">
            </div>
            <div class="theme-name">Dark</div>
          </div>
          <div @click="changeTheme('green')" class="theme-item green">
            <div class="theme-image">
              <img src="../assets/image/green.png" alt="">
            </div>
            <div class="theme-name">Green</div>
          </div>
          <div @click="changeTheme('pink')" class="theme-item pink">
            <div class="theme-image">
              <img src="../assets/image/pink.png" alt="">
            </div>
            <div class="theme-name">Pink</div>
          </div>
        </div>
      </div>
      <div class="qrcode">
        <div class="title">请作者吃辣条</div>
        <div class="qrcode-box">
          <img class="qrcode-item" src="../assets/image/wepay-hunlongyu.png">
          <img class="qrcode-item" src="../assets/image/wepay_cuiocean.jpg">
        </div>
      </div>
      <div class="clearDB">
        <span @click="clearDBEvent" class="clearBtn">软件重置</span>
        <span @click="changePasswordEvent" class="clearBtn">设置密码</span>
        <div class="clearTips">如果新安装用户, 无法显示资源, 请点击软件重置. 如非必要, 切勿点击. 会清空用户数据, 恢复默认设置. 点击即软件重置, 并关闭软件.</div>
      </div>
      <div class="Tips">
        <span>所有资源来自网上, 该软件不参与任何制作, 上传, 储存等内容, 禁止传播违法资源. 该软件仅供学习参考, 请于安装后24小时内删除.</span>
      </div>
    </div>
    <div> <!-- 输入密码页面 -->
      <el-dialog :visible.sync="show.checkPasswordDialog" v-if='show.checkPasswordDialog' :append-to-body="true" @close="closeDialog" width="300px">
        <el-form label-width="75px" label-position="left">
          <el-form-item label="当前密码" prop='name'>
            <el-input v-model="inputPassword" placeholder="请输入您的当前密码" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="checkPasswordEvent">确定</el-button>
        </span>
      </el-dialog>
    </div>
    <div> <!-- 修改密码页面 -->
      <el-dialog :visible.sync="show.changePasswordDialog" v-if='show.changePasswordDialog' :append-to-body="true" @close="closeDialog" width="300px">
        <el-form label-width="75px" label-position="left">
          <el-form-item label="新密码" prop='name'>
            <el-input v-model="inputPassword" placeholder="请输入您的新密码" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="confirmedChangePasswordEvent">确定</el-button>
        </span>
      </el-dialog>
    </div>
    <div> <!-- 代理设置界面 -->
      <el-dialog :visible.sync="show.proxyDialog" :append-to-body="true" @close="closeDialog" width="400px">
        <el-form label-width="50px" label-position="left" size="small">
          <el-form-item label="协议: " prop='scheme'>
            <el-col :span="15">
              <el-select v-model="proxy.scheme" placeholder="请选择协议类型">
                <el-option label="http" value="http"></el-option>
                <el-option label="socks5" value="socks5"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="地址: " prop='url'>
            <el-col :span="15">
              <el-input v-model="proxy.url" placeholder="地址" />
            </el-col>
            <el-col class="line" :span="2" style="text-align: center;">:</el-col>
            <el-col :span="7">
              <el-input v-model="proxy.port" placeholder="端口" width="80px" />
            </el-col>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="proxyConfirm">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import pkg from '../../package.json'
import { setting, sites, shortcut } from '../lib/dexie'
import { sites as defaultSites } from '../lib/dexie/initData'
import { shell, clipboard, remote, ipcRenderer } from 'electron'
import db from '../lib/dexie/dexie'
import zy from '../lib/site/tools'
export default {
  name: 'setting',
  data () {
    return {
      pkg: pkg,
      shortcutList: [],
      show: {
        site: false,
        shortcut: false,
        view: false,
        editPlayerPath: false,
        checkPasswordDialog: false,
        changePasswordDialog: false,
        proxy: false,
        proxyDialog: false
      },
      d: { },
      latestVersion: pkg.version,
      inputPassword: '',
      action: '',
      proxy: {
        type: '',
        scheme: '',
        url: '',
        port: ''
      }
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
    setting: {
      get () {
        return this.$store.getters.getSetting
      },
      set (val) {
        this.SET_SETTING(val)
      }
    }
  },
  methods: {
    ...mapMutations(['SET_SETTING', 'SET_VIEW']),
    linkOpen (e) {
      shell.openExternal(e)
    },
    getSetting () {
      setting.find().then(res => {
        this.d = res
        this.setting = this.d
      })
    },
    getSites () {
      sites.all().then(res => {
        if (res.length <= 0) {
          this.$message.warning('检测到视频源未能正常加载, 即将重置源.')
          sites.clear().then(sites.bulkAdd(defaultSites).then(this.getSites()))
        }
      })
    },
    getShortcut () {
      shortcut.all().then(res => {
        this.shortcutList = res
      })
    },
    changeView (e) {
      this.d.view = e
      this.updateSettingEvent()
      this.show.view = false
    },
    async clearCache () {
      const win = remote.getCurrentWindow()
      const ses = win.webContents.session
      const size = await ses.getCacheSize() / 1024 / 1024
      const mb = size.toFixed(2)
      await ses.clearCache()
      this.$message.success(`清除缓存成功, 共清理 ${mb} MB`)
    },
    updateSettingEvent () {
      this.show.editPlayerPath = false
      this.setting = this.d
      setting.update(this.d)
    },
    toggleExcludeR18Films () {
      this.d.excludeR18Films = !this.d.excludeR18Films
      this.updateSettingEvent()
    },
    toggleExcludeRootClasses () {
      this.d.excludeRootClasses = !this.d.excludeRootClasses
      this.updateSettingEvent()
    },
    selectLocalPlayer () {
      const options = {
        filters: [
          { name: 'Executable file', extensions: ['exe'] },
          { name: 'All types', extensions: ['*'] }
        ],
        properties: ['openFile']
      }
      remote.dialog.showOpenDialog(options).then(result => {
        if (!result.canceled) {
          var playerPath = result.filePaths[0].replace(/\\/g, '/')
          this.$message.success('设定第三方播放器路径为：' + result.filePaths[0])
          this.d.externalPlayer = playerPath
          this.updateSettingEvent()
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    resetLocalPlayer () {
      this.d.externalPlayer = ''
      setting.update(this.d).then(res => {
        this.updateSettingEvent()
        this.$message.success('重置第三方播放器成功')
      })
    },
    updatePlayerPath () {
      this.$message.success('设定第三方播放器路径为：' + this.d.externalPlayer)
      this.show.editPlayerPath = false
      this.updateSettingEvent()
    },
    editSitesEvent () {
      if (this.d.password) {
        this.action = 'EditSites'
        this.show.checkPasswordDialog = true
      } else {
        this.view = 'EditSites'
      }
    },
    async closeDialog () {
      this.show.checkPasswordDialog = false
      this.show.changePasswordDialog = false
      if (this.show.proxyDialog) {
        this.show.proxyDialog = false
        this.setting.proxy.type = 'none'
        await this.updateSettingEvent()
        this.$message.info('取消使用代理')
        zy.proxy()
      }
      this.inputPassword = ''
    },
    checkPasswordEvent () {
      if (this.inputPassword === this.d.password) {
        this.closeDialog()
        if (this.action === 'EditSites') {
          this.view = 'EditSites'
        } else if (this.action === 'ChangePassword') {
          this.show.changePasswordDialog = true
        } else if (this.action === 'CleanDB') {
          this.clearDB()
        }
      } else {
        this.$message.error('您输入的密码错误，请重试')
      }
    },
    changePasswordEvent () {
      if (this.d.password) {
        this.action = 'ChangePassword'
        this.show.checkPasswordDialog = true
      } else {
        this.show.changePasswordDialog = true
      }
    },
    confirmedChangePasswordEvent () {
      this.d.password = this.inputPassword
      this.updateSettingEvent()
      this.closeDialog()
    },
    changeTheme (e) {
      this.d.theme = e
      this.updateSettingEvent()
    },
    changeShortcut (e) {
      this.d.shortcut = e
      this.updateSettingEvent()
      this.show.shortcut = false
    },
    expShortcut () {
      const arr = [...this.shortcutList]
      const str = JSON.stringify(arr, null, 2)
      clipboard.writeText(str)
      this.$message.success('已复制到剪贴板')
    },
    impShortcut () {
      const str = clipboard.readText()
      const json = JSON.parse(str)
      shortcut.clear().then(res => {
        this.$message.info('已清空原数据')
        shortcut.add(json).then(e => {
          this.$message.success('已添加成功')
          this.getSites()
        })
      })
    },
    async changeProxyType (e) {
      this.d.proxy.type = e
      if (e === 'manual') {
        this.show.proxyDialog = true
        this.proxy.scheme = this.setting.proxy.scheme
        this.proxy.url = this.setting.proxy.url
        this.proxy.port = this.setting.proxy.port
      }
      await this.updateSettingEvent()
      this.show.proxy = false
      zy.proxy()
    },
    async proxyConfirm () {
      this.d.proxy.scheme = this.proxy.scheme
      this.d.proxy.url = this.proxy.url
      this.d.proxy.port = this.proxy.port
      await this.updateSettingEvent()
      this.show.proxyDialog = false
      zy.proxy()
      this.$message.info('开始使用代理')
    },
    clearDBEvent () {
      if (this.d.password) {
        this.action = 'CleanDB'
        this.show.checkPasswordDialog = true
      } else {
        this.clearDB()
      }
    },
    clearDB () {
      db.delete().then(res => {
        this.$message.success('重置成功')
        const win = remote.getCurrentWindow()
        win.destroy()
      })
    },
    openDoc (e) {
      if (e === 'sites') {
        this.linkOpen('http://zyplayer.fun/doc/sites/')
        return false
      }
      if (e === 'shortcut') {
        this.linkOpen('http://zyplayer.fun/doc/shortcut/')
        return false
      }
    },
    getLatestVersion () {
      ipcRenderer.send('checkForUpdate')
      ipcRenderer.on('update-available', (e, info) => {
        this.latestVersion = info.version
      })
      ipcRenderer.on('update-error', () => {
        this.$message.warning = '更新出错.'
      })
      ipcRenderer.on('update-downloaded', () => {
        this.$message.info = '下载完毕, 退出安装'
      })
    },
    quitAndInstall () {
      this.$message.success('已开始下载更新，下载完毕后，将自动退出安装。')
      ipcRenderer.send('quitAndInstall')
    },
    createContextMenu () {
      const { Menu, MenuItem } = remote
      const menu = new Menu()
      menu.append(new MenuItem({ label: '快速复制', role: 'copy' }))
      menu.append(new MenuItem({ label: '快速粘贴', role: 'paste' }))
      menu.append(new MenuItem({ label: '编辑', role: 'editMenu' }))
      window.addEventListener('contextmenu', e => {
        e.preventDefault()
        menu.popup(remote.getCurrentWindow())
      })
    }
  },
  created () {
    this.getSites()
    this.getSetting()
    this.getShortcut()
    this.getLatestVersion()
    this.createContextMenu()
  }
}
</script>
<style lang="scss" scoped>
.setting{
  height: calc(100% - 40px);
  width: 100%;
  border-radius: 5px;
  padding: 20px 0;
  .setting-box{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  .logo{
    margin-top: 10px;
    width: 100%;
    text-align: center;
    img{
      width: 120px;
      height: auto;
    }
  }
  .info{
    width: 100%;
    margin-top: 20px;
    text-align: center;
    a{
      text-decoration: none;
      margin: 0 10px;
      font-size: 14px;
      cursor: pointer;
    }
  }
  .view{
    width: 100%;
    padding: 20px;
    margin-top: 20px;
    .view-box{
      margin-top: 10px;
      .zy-select{
        margin-right: 20px;
      }
    }
  }
  .site{
    width: 100%;
    padding: 20px;
    margin-top: 20px;
    .site-box{
      margin-top: 10px;
      .zy-select{
        margin-right: 20px;
      }
    }
  }
  .shortcut{
    width: 100%;
    padding: 20px;
    margin-top: 20px;
    .shortcut-box{
      margin-top: 10px;
      .zy-select{
        margin-right: 20px;
      }
    }
  }
  .theme{
    width: 100%;
    padding-left: 20px;
    margin-top: 20px;
    .theme-box{
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      margin-top: 10px;
      .theme-item{
        width: 200px;
        height: 180px;
        margin-right: 20px;
        cursor: pointer;
        border-radius: 2px;
        .theme-image{
          width: 180px;
          margin: 10px auto;
          img{
            width: 100%;
          }
        }
        .theme-name{
          width: 100%;
          text-align: center;
        }
      }
    }
  }
  .qrcode{
    width: 100%;
    padding-left: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
    .qrcode-box{
      display: flex;
      justify-content: flex-start;
      margin-top: 10px;
      .qrcode-item{
        width: auto;
        height: 300px;
        margin-right: 20px;
        border-radius: 2px;
      }
    }
  }
  .clearDB{
    margin-top: 20px;
    margin-bottom: 20px;
    .clearBtn{
      margin-left: 20px;
      color: red;
      cursor: pointer;
      border: 1px solid #ff000088;
      display: inline-block;
      width: 160px;
      height: 32px;
      font-size: 14px;
      text-align: center;
      line-height: 32px;
    }
    .clearTips{
      margin: 10px 0 0 20px;
      font-size: 12px;
      color: #ff000088;
    }
  }
  .Tips{
    margin: 20px;
    font-size: 12px;
    color: #ff000066;
  }
}
</style>
