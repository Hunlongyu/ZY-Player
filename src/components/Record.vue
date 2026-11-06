<template>
  <div class="record-mask" v-show="!externalControl" @mousedown.self="close">
    <div
      class="record-panel"
      :class="{ compact: step === 'countdown' || step === 'recording' }"
      :style="panelStyle"
      ref="panel"
      tabindex="-1"
      @click.stop
      @keydown.stop
      @keydown.esc.stop="close"
      @keyup.stop>
      <div class="record-header" @mousedown.prevent="startPanelDrag" title="拖动标题栏移动面板">
        <span class="record-title">屏幕录制</span>
        <span class="record-close" @mousedown.stop @click="close">×</span>
      </div>

      <!-- 选择屏幕 -->
      <div v-if="step === 'source'" class="record-body">
        <p class="tip">选择要录制的屏幕：</p>
        <div class="source-list">
          <div
            class="source-item"
            v-for="s in sources"
            :key="s.id"
            :class="{ active: selectedSource && selectedSource.id === s.id }"
            @click="selectSource(s)">
            <img :src="s.thumbnail" draggable="false">
            <span class="source-name">{{ s.name }}</span>
          </div>
        </div>
        <p class="tip small" v-if="sources.length === 0">没有获取到可录制的屏幕，请检查系统权限。</p>
        <div class="record-footer">
          <el-button size="small" @click="close">取消</el-button>
          <el-button size="small" type="primary" :disabled="!selectedSource" @click="goSelect">下一步</el-button>
        </div>
      </div>

      <!-- 框选区域 -->
      <div v-else-if="step === 'select' && selectedSource" class="record-body">
        <p class="tip">按住鼠标左键拖动框选区域；不框选则录制整个屏幕。</p>
        <div class="preview-wrap">
          <div
            class="preview-box"
            ref="previewBox"
            @mousedown.prevent="startSelect"
            @mousemove="updateSelect">
            <img :src="selectedSource.thumbnail" draggable="false">
            <div class="selection" v-if="selectionPx" :style="selectionStyle"></div>
          </div>
        </div>
        <p class="tip small" v-if="selectionPx">{{ selectionText }}</p>
        <p class="tip small" v-else>当前为全屏录制</p>
        <label class="minimize-option">
          <input type="checkbox" v-model="minimizeOnRecord">
          开始后最小化窗口（录制控制条会独立悬浮，可拖到任意位置）
        </label>
        <label class="minimize-option">
          <input type="checkbox" v-model="recordAudio">
          录制系统声音（系统不支持时自动切换为静音）
        </label>
        <div class="record-footer">
          <el-button size="small" @click="step = 'source'">上一步</el-button>
          <el-button size="small" :disabled="!selectionPx" @click="selectionPx = null">重置选区</el-button>
          <el-button size="small" type="primary" @click="startRecording">开始录制</el-button>
        </div>
      </div>

      <!-- 倒计时 -->
      <div v-else-if="step === 'countdown'" class="record-body center">
        <div class="countdown-number">{{ countdown }}</div>
        <p class="tip">秒后开始录制... 请切换到要录制的画面</p>
        <div class="record-footer center">
          <el-button size="small" @click="cancelRecordCountdown">取消</el-button>
        </div>
      </div>

      <!-- 录制中 -->
      <div v-else-if="step === 'recording'" class="record-body center">
        <div class="rec-status">
          <span class="rec-dot" :class="{ paused }"></span>
          <span>{{ paused ? '已暂停' : '正在录制' }}</span>
        </div>
        <div class="timer">{{ formatTime(elapsed) }}</div>
        <p class="tip">{{ selectionPx ? '区域录制' : '全屏录制' }} · {{ hasAudio ? '含系统声音' : '静音' }}</p>
        <div class="record-footer center">
          <el-button size="small" @click="togglePause">{{ paused ? '继续录制' : '暂停' }}</el-button>
          <el-button size="small" type="danger" @click="stopRecording">停止并预览</el-button>
        </div>
        <p class="tip small">开始录制后若窗口已最小化，可使用 Ctrl+Alt+P 暂停/继续，Ctrl+Alt+S 停止。</p>
      </div>

      <!-- 预览与裁切 -->
      <div v-else-if="step === 'review'" class="record-body">
        <video
          ref="preview"
          class="preview-video"
          :src="previewUrl"
          controls
          @loadedmetadata="onPreviewLoaded"></video>
        <div class="trim">
          <div class="trim-row">
            <label>开始</label>
            <input type="range" min="0" :max="duration || 0" step="0.1" v-model.number="trimStart" @input="onTrimInput('start')">
            <span class="trim-value">{{ formatTime(trimStart) }}</span>
          </div>
          <div class="trim-row">
            <label>结束</label>
            <input type="range" min="0" :max="duration || 0" step="0.1" v-model.number="trimEnd" @input="onTrimInput('end')">
            <span class="trim-value">{{ formatTime(trimEnd) }}</span>
          </div>
          <div class="timeline">
            <div class="timeline-range" :style="timelineStyle"></div>
          </div>
          <p class="tip small">
            裁切后时长：{{ formatTime(trimEnd - trimStart) }}，{{ hasAudio ? '含系统声音' : '静音' }}
            <span v-if="cropRect">，输出区域：{{ cropRect.w }} × {{ cropRect.h }}</span>
          </p>
        </div>
        <div class="record-footer">
          <el-button size="small" @click="retake">重新录制</el-button>
          <el-button size="small" @click="close">取消</el-button>
          <el-button size="small" type="primary" :disabled="saving || duration <= 0 || trimEnd <= trimStart" @click="save">保存为 MP4</el-button>
        </div>
      </div>

      <!-- 转码中 -->
      <div v-else-if="step === 'saving'" class="record-body center">
        <div class="timer">{{ Math.round(progress) }}%</div>
        <el-progress :percentage="Math.round(progress)" :show-text="false"></el-progress>
        <p class="tip">正在转码为 MP4，请稍候...</p>
        <div class="record-footer center">
          <el-button size="small" @click="cancelSave">取消</el-button>
        </div>
      </div>

      <!-- 保存完成 -->
      <div v-else-if="step === 'done'" class="record-body center">
        <p class="done-title">保存成功</p>
        <p class="saved-path">{{ savedPath }}</p>
        <div class="record-footer center">
          <el-button size="small" @click="openFolder">打开所在文件夹</el-button>
          <el-button size="small" type="primary" @click="close">完成</el-button>
        </div>
      </div>

      <div v-if="error" class="record-error">{{ error }}</div>
      <div v-if="notice" class="record-notice">{{ notice }}</div>
    </div>
  </div>
</template>

<script>
import { spawn } from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'
const remote = require('@electron/remote')
const electron = require('electron')

const MIME_TYPES_VIDEO = ['video/webm;codecs=vp8', 'video/webm;codecs=vp9', 'video/webm']
const MIME_TYPES_AUDIO = ['video/webm;codecs=vp8,opus', 'video/webm;codecs=vp9,opus', 'video/webm']

export default {
  name: 'record-screen',
  data () {
    return {
      step: 'source',
      sources: [],
      selectedSource: null,
      selectionPx: null,
      elapsed: 0,
      paused: false,
      countdown: 0,
      dragOffset: { x: 0, y: 0 },
      externalControl: false,
      previewUrl: '',
      duration: 0,
      trimStart: 0,
      trimEnd: 0,
      cropRect: null,
      saving: false,
      progress: 0,
      savedPath: '',
      error: '',
      notice: '',
      minimizeOnRecord: true,
      recordAudio: true,
      hasAudio: false
    }
  },
  computed: {
    selectionStyle () {
      if (!this.selectionPx) return {}
      return {
        left: this.selectionPx.x + 'px',
        top: this.selectionPx.y + 'px',
        width: this.selectionPx.w + 'px',
        height: this.selectionPx.h + 'px'
      }
    },
    selectionText () {
      if (!this.selectionPx || !this.selectedSource) return ''
      const box = this.$refs.previewBox
      if (!box) return ''
      const scaleX = this.selectedSource.size.width / box.clientWidth
      const scaleY = this.selectedSource.size.height / box.clientHeight
      return `已选择约 ${Math.round(this.selectionPx.w * scaleX)} × ${Math.round(this.selectionPx.h * scaleY)} 像素`
    },
    timelineStyle () {
      if (!this.duration) return { left: '0%', width: '0%' }
      return {
        left: (this.trimStart / this.duration * 100) + '%',
        width: (Math.max(0, this.trimEnd - this.trimStart) / this.duration * 100) + '%'
      }
    },
    panelStyle () {
      return { transform: `translate(${this.dragOffset.x}px, ${this.dragOffset.y}px)` }
    }
  },
  created () {
    this._recorder = null
    this._stream = null
    this._chunks = []
    this._tempFile = ''
    this._timerId = null
    this._lastTick = 0
    this._dragStart = null
    this._normalizedSelection = null
    this._videoWidth = 0
    this._videoHeight = 0
    this._ffmpegProc = null
    this._saveCanceled = false
    this._savingOutput = ''
    this._savingOutputExisted = false
    this._saveGeneration = 0
    this._shortcutApi = null
    this._minimizedByRecord = false
    this._onDocMouseMove = null
    this._onDocMouseUp = null
    this._recordedBytes = 0
    this._largeNotified = false
    this._countdownTimer = null
    this._countdownResolve = null
    this._countdownCanceled = false
    this._recordAttempt = 0
    this._processing = false
    this._pendingOptions = null
    this._panelDragStart = null
    this._panelMoveHandler = null
    this._panelUpHandler = null
    this._destroyed = false
    this._controlOpen = false
    this._controlClosing = false
    this._controlActionHandler = (event, action) => this.handleControlAction(action)
    this._controlClosedHandler = () => this.handleControlClosed()
    electron.ipcRenderer.on('record-control:action', this._controlActionHandler)
    electron.ipcRenderer.on('record-control:closed', this._controlClosedHandler)
    this.loadSources()
  },
  mounted () {
    if (this.$refs.panel) this.$refs.panel.focus()
  },
  beforeDestroy () {
    this._destroyed = true
    this.closeControlWindow()
    electron.ipcRenderer.removeListener('record-control:action', this._controlActionHandler)
    electron.ipcRenderer.removeListener('record-control:closed', this._controlClosedHandler)
    this.cancelCountdown()
    this.endPanelDrag()
    this.unregisterShortcuts()
    this.stopTimer()
    if (this._recorder && this._recorder.state !== 'inactive') {
      this._recorder.onstop = null
      try { this._recorder.stop() } catch (e) {}
    }
    this._recorder = null
    this.stopStream()
    this.removeTemp()
    this.revokePreview()
    if (this._ffmpegProc) {
      this._saveGeneration++
      try { this._ffmpegProc.kill('SIGKILL') } catch (e) {}
      this._ffmpegProc = null
    }
    document.removeEventListener('mousemove', this._onDocMouseMove)
    document.removeEventListener('mouseup', this._onDocMouseUp)
  },
  methods: {
    async loadSources () {
      try {
        const options = {
          types: ['screen'],
          thumbnailSize: { width: 1920, height: 1080 },
          fetchWindowIcons: false
        }
        let sources = []
        const capturer = electron.desktopCapturer || remote.desktopCapturer
        if (!capturer) throw new Error('当前 Electron 版本不支持桌面采集')
        try {
          sources = await capturer.getSources(options)
        } catch (e) {
          if (remote.desktopCapturer && capturer !== remote.desktopCapturer) {
            sources = await remote.desktopCapturer.getSources(options)
          } else {
            throw e
          }
        }
        this.sources = sources.map(source => {
          const size = source.thumbnail.getSize()
          let thumbnail = ''
          try {
            thumbnail = 'data:image/jpeg;base64,' + source.thumbnail.toJPEG(85).toString('base64')
          } catch (e) {}
          return {
            id: source.id,
            name: source.name || '屏幕',
            size,
            thumbnail
          }
        })
        if (this.sources.length === 1) {
          this.selectedSource = this.sources[0]
          this.step = 'select'
        }
      } catch (e) {
        this.error = '获取屏幕列表失败：' + (e.message || e)
      }
    },
    selectSource (source) {
      this.selectedSource = source
      this.selectionPx = null
    },
    goSelect () {
      if (!this.selectedSource) return
      this.selectionPx = null
      this.step = 'select'
    },
    pointInBox (e) {
      const box = this.$refs.previewBox
      if (!box) return null
      const rect = box.getBoundingClientRect()
      return {
        x: Math.min(Math.max(e.clientX - rect.left, 0), rect.width),
        y: Math.min(Math.max(e.clientY - rect.top, 0), rect.height),
        width: rect.width,
        height: rect.height
      }
    },
    startSelect (e) {
      const point = this.pointInBox(e)
      if (!point) return
      this._dragStart = point
      this.selectionPx = { x: point.x, y: point.y, w: 0, h: 0 }
      this._onDocMouseMove = ev => this.updateSelect(ev)
      this._onDocMouseUp = () => this.endSelect()
      document.addEventListener('mousemove', this._onDocMouseMove)
      document.addEventListener('mouseup', this._onDocMouseUp)
    },
    updateSelect (e) {
      if (!this._dragStart) return
      const point = this.pointInBox(e)
      if (!point) return
      const start = this._dragStart
      this.selectionPx = {
        x: Math.min(start.x, point.x),
        y: Math.min(start.y, point.y),
        w: Math.abs(point.x - start.x),
        h: Math.abs(point.y - start.y)
      }
    },
    endSelect () {
      document.removeEventListener('mousemove', this._onDocMouseMove)
      document.removeEventListener('mouseup', this._onDocMouseUp)
      this._onDocMouseMove = null
      this._onDocMouseUp = null
      this._dragStart = null
      if (this.selectionPx && (this.selectionPx.w < 8 || this.selectionPx.h < 8)) this.selectionPx = null
    },
    startPanelDrag (e) {
      if (e.button !== 0) return
      this.endPanelDrag()
      this._panelDragStart = {
        x: e.clientX,
        y: e.clientY,
        ox: this.dragOffset.x,
        oy: this.dragOffset.y
      }
      this._panelMoveHandler = ev => {
        if (!this._panelDragStart) return
        this.dragOffset = {
          x: this._panelDragStart.ox + ev.clientX - this._panelDragStart.x,
          y: this._panelDragStart.oy + ev.clientY - this._panelDragStart.y
        }
      }
      this._panelUpHandler = () => this.endPanelDrag()
      document.addEventListener('mousemove', this._panelMoveHandler)
      document.addEventListener('mouseup', this._panelUpHandler)
    },
    endPanelDrag () {
      if (this._panelMoveHandler) document.removeEventListener('mousemove', this._panelMoveHandler)
      if (this._panelUpHandler) document.removeEventListener('mouseup', this._panelUpHandler)
      this._panelMoveHandler = null
      this._panelUpHandler = null
      this._panelDragStart = null
    },
    async openControlWindow () {
      if (this._controlOpen) return true
      try {
        const opened = await electron.ipcRenderer.invoke('record-control:open')
        this._controlOpen = !!opened
        if (this._controlOpen) this._controlClosing = false
        return this._controlOpen
      } catch (e) {
        this._controlOpen = false
        return false
      }
    },
    closeControlWindow () {
      this.externalControl = false
      if (!this._controlOpen) return
      this._controlOpen = false
      this._controlClosing = true
      electron.ipcRenderer.send('record-control:close')
    },
    sendControlState () {
      if (!this._controlOpen) return
      const phase = this.step === 'countdown'
        ? 'countdown'
        : (this._processing ? 'processing' : 'recording')
      electron.ipcRenderer.send('record-control:update', {
        phase,
        countdown: this.countdown,
        elapsed: this.elapsed,
        paused: this.paused,
        hasAudio: this.hasAudio,
        region: !!this.selectionPx
      })
    },
    handleControlAction (action) {
      if (this.step === 'countdown' && action === 'cancel') {
        this.cancelRecordCountdown()
      } else if (this.step === 'recording' && action === 'pause') {
        this.togglePause()
      } else if (this.step === 'recording' && action === 'stop') {
        this.stopRecording()
      }
    },
    handleControlClosed () {
      const wasOpen = this._controlOpen
      this._controlOpen = false
      this.externalControl = false
      if (this._controlClosing) {
        this._controlClosing = false
        return
      }
      if (!wasOpen) return
      if (this.step === 'countdown') {
        this._recordAttempt += 1
        this.cancelCountdown()
        this.stopStream()
        this.step = this.selectedSource ? 'select' : 'source'
      } else if (this.step === 'recording') {
        this.stopRecording()
      }
    },
    async waitCountdown (seconds) {
      this.countdown = seconds
      this._countdownCanceled = false
      this.step = 'countdown'
      const opened = await this.openControlWindow()
      if (this._countdownCanceled || this._destroyed) {
        if (opened) this.closeControlWindow()
        return false
      }
      this.externalControl = opened
      this.sendControlState()
      return new Promise(resolve => {
        this._countdownResolve = resolve
        this._countdownTimer = setInterval(() => {
          if (this._countdownCanceled) return
          this.countdown -= 1
          this.sendControlState()
          if (this.countdown <= 0) {
            if (this._countdownTimer) {
              clearInterval(this._countdownTimer)
              this._countdownTimer = null
            }
            const done = this._countdownResolve
            this._countdownResolve = null
            if (done) done(true)
          }
        }, 1000)
      })
    },
    cancelCountdown () {
      this._countdownCanceled = true
      if (this._countdownTimer) {
        clearInterval(this._countdownTimer)
        this._countdownTimer = null
      }
      this.countdown = 0
      const done = this._countdownResolve
      this._countdownResolve = null
      if (done) done(false)
    },
    cancelRecordCountdown () {
      this._recordAttempt += 1
      this.closeControlWindow()
      this.cancelCountdown()
      this.stopStream()
      this.step = this.selectedSource ? 'select' : 'source'
    },
    delay (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    async startRecording () {
      if (this.step === 'countdown' || this.step === 'recording' || this.step === 'saving') return
      this.error = ''
      this.notice = ''
      if (!this.selectedSource) {
        this.error = '请先选择要录制的屏幕'
        return
      }
      const attempt = ++this._recordAttempt
      // 预览区域在进入倒计时后会被移除，先记录框选比例
      this.captureSelectionRatio()
      const prepared = this.prepareRecording(attempt)
      let ok = false
      try {
        const result = await Promise.all([this.waitCountdown(5), prepared])
        ok = result[0]
      } catch (e) {
        if (attempt !== this._recordAttempt || this._destroyed) return
        this.closeControlWindow()
        this.cancelCountdown()
        this.stopStream()
        this.step = this.selectedSource ? 'select' : 'source'
        this.error = '启动录制失败：' + (e.message || e)
        return
      }
      if (!ok || this._destroyed || attempt !== this._recordAttempt) {
        this.closeControlWindow()
        if (attempt === this._recordAttempt) this.stopStream()
        return
      }
      if (this.minimizeOnRecord) {
        const registered = this.registerShortcuts()
        if (this._controlOpen || registered) {
          const win = remote.getCurrentWindow()
          if (!win.isDestroyed()) {
            this._minimizedByRecord = true
            win.minimize()
          }
          // 等待窗口最小化完成，避免录制到设置面板
          await this.delay(300)
        } else {
          this.notice = '全局快捷键注册失败，已保持窗口显示（可手动暂停/停止）'
        }
      }
      if (this._destroyed || attempt !== this._recordAttempt) {
        this.closeControlWindow()
        if (attempt === this._recordAttempt) this.stopStream()
        return
      }
      this.startPreparedRecording(attempt)
    },
    prepareRecording (attempt) {
      const size = this.selectedSource.size
      const videoConstraints = {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: this.selectedSource.id,
          maxWidth: 3840,
          maxHeight: 2160,
          maxFrameRate: 30
        }
      }
      this.hasAudio = false
      const acquire = async () => {
        let stream
        if (this.recordAudio) {
          const audioRequest = navigator.mediaDevices.getUserMedia({
            audio: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: this.selectedSource.id
              }
            },
            video: videoConstraints
          })
          try {
            stream = await Promise.race([
              audioRequest,
              new Promise((resolve, reject) => setTimeout(() => reject(new Error('系统声音采集超时')), 3000))
            ])
          } catch (e) {
            audioRequest.then(s => s.getTracks().forEach(t => t.stop())).catch(() => {})
            stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: videoConstraints })
            if (attempt === this._recordAttempt) this.notice = '系统声音采集不可用，已切换为静音录制'
          }
        } else {
          stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: videoConstraints })
        }
        if (this._destroyed || attempt !== this._recordAttempt) {
          stream.getTracks().forEach(t => t.stop())
          throw new Error('录制已取消')
        }
        this._stream = stream
        this.hasAudio = stream.getAudioTracks().length > 0
        const track = stream.getVideoTracks()[0]
        const settings = track.getSettings ? track.getSettings() : {}
        this._videoWidth = settings.width || size.width
        this._videoHeight = settings.height || size.height
        return stream
      }
      return acquire()
    },
    startPreparedRecording (attempt) {
      if (!this._stream) {
        this.closeControlWindow()
        return
      }
      if (this._destroyed || attempt !== this._recordAttempt) {
        this.closeControlWindow()
        this.stopStream()
        return
      }
      this.computeCrop()

      const mimeTypes = this.hasAudio ? MIME_TYPES_AUDIO : MIME_TYPES_VIDEO
      const mimeType = mimeTypes.find(type => window.MediaRecorder && MediaRecorder.isTypeSupported(type))
      const bitrate = Math.min(24000000, Math.max(6000000, Math.round(this._videoWidth * this._videoHeight * 3)))
      const options = { videoBitsPerSecond: bitrate }
      if (this.hasAudio) options.audioBitsPerSecond = 128000
      if (mimeType) options.mimeType = mimeType
      this._chunks = []
      this._recordedBytes = 0
      this._largeNotified = false
      try {
        this._recorder = new MediaRecorder(this._stream, options)
        this._recorder.ondataavailable = e => {
          if (e.data && e.data.size) {
            this._chunks.push(e.data)
            this._recordedBytes += e.data.size
            if (!this._largeNotified && this._recordedBytes > 512 * 1024 * 1024) {
              this._largeNotified = true
              this.notice = '录制数据已超过 500MB，建议尽快停止，避免内存占用过高'
            }
          }
        }
        this._recorder.onstop = () => this.onRecorderStop()
        this._recorder.onerror = e => {
          this.error = '录制失败：' + ((e.error && e.error.message) || '未知错误')
        }
        this._recorder.start(1000)
      } catch (e) {
        this._recorder = null
        this.unregisterShortcuts()
        this.restoreWindow()
        this.closeControlWindow()
        this.stopStream()
        this.error = '启动录制失败：' + (e.message || e)
        return
      }
      this.elapsed = 0
      this.paused = false
      this.step = 'recording'
      this.sendControlState()
      this.startTimer()
    },
    captureSelectionRatio () {
      this._normalizedSelection = null
      if (!this.selectionPx) return null
      const box = this.$refs.previewBox
      if (!box) return null
      const rect = box.getBoundingClientRect()
      if (!rect.width || !rect.height) return null
      const selection = {
        x: Math.min(Math.max(this.selectionPx.x / rect.width, 0), 1),
        y: Math.min(Math.max(this.selectionPx.y / rect.height, 0), 1),
        w: Math.min(this.selectionPx.w / rect.width, 1),
        h: Math.min(this.selectionPx.h / rect.height, 1)
      }
      this._normalizedSelection = selection
      return selection
    },
    computeCrop () {
      this.cropRect = null
      const selection = this._normalizedSelection
      if (!selection) return
      const even = n => Math.max(0, Math.floor(n / 2) * 2)
      let width = Math.max(2, even(selection.w * this._videoWidth))
      let height = Math.max(2, even(selection.h * this._videoHeight))
      let x = Math.min(even(selection.x * this._videoWidth), Math.max(0, this._videoWidth - width))
      let y = Math.min(even(selection.y * this._videoHeight), Math.max(0, this._videoHeight - height))
      width = Math.max(2, even(Math.min(width, this._videoWidth - x)))
      height = Math.max(2, even(Math.min(height, this._videoHeight - y)))
      if (width < 2 || height < 2) return
      if (width < this._videoWidth || height < this._videoHeight || x > 0 || y > 0) {
        this.cropRect = { x, y, w: width, h: height }
      }
    },
    startTimer () {
      this._lastTick = Date.now()
      this.stopTimer()
      this._timerId = setInterval(() => {
        if (this.paused) return
        const now = Date.now()
        this.elapsed += (now - this._lastTick) / 1000
        this._lastTick = now
        this.sendControlState()
      }, 200)
    },
    stopTimer () {
      if (this._timerId) {
        clearInterval(this._timerId)
        this._timerId = null
      }
    },
    togglePause () {
      if (!this._recorder) return
      if (this._recorder.state === 'recording') {
        this._recorder.pause()
        this.paused = true
      } else if (this._recorder.state === 'paused') {
        this._recorder.resume()
        this._lastTick = Date.now()
        this.paused = false
      }
      this.sendControlState()
    },
    stopRecording () {
      if (!this._recorder || this._recorder.state === 'inactive') return
      this.stopTimer()
      this._recorder.stop()
    },
    async onRecorderStop () {
      this.stopTimer()
      this.stopStream()
      this.unregisterShortcuts()
      this._processing = true
      this.sendControlState()
      const mimeType = (this._recorder && this._recorder.mimeType) || 'video/webm'
      const blob = new Blob(this._chunks, { type: mimeType })
      this._chunks = []
      this._recorder = null
      if (!blob.size) {
        this._processing = false
        this.closeControlWindow()
        this.restoreWindow()
        this.error = '没有录制到任何内容'
        this.step = 'select'
        return
      }
      try {
        this.removeTemp()
        this._tempFile = path.join(os.tmpdir(), `zy-record-${Date.now()}.webm`)
        const buffer = Buffer.from(await blob.arrayBuffer())
        await fs.promises.writeFile(this._tempFile, buffer)
        this.revokePreview()
        this.previewUrl = window.URL.createObjectURL(blob)
        this.duration = 0
        this.trimStart = 0
        this.trimEnd = 0
        this.step = 'review'
      } catch (e) {
        this.error = '保存录制临时文件失败：' + (e.message || e)
        this.step = 'select'
      }
      this._processing = false
      this.closeControlWindow()
      this.restoreWindow()
    },
    onPreviewLoaded () {
      const video = this.$refs.preview
      if (!video) return
      if (isFinite(video.duration) && video.duration > 0) {
        this.duration = video.duration
        this.trimEnd = video.duration
        return
      }
      // MediaRecorder 产生的 WebM 常常没有时长元数据，跳到末尾可强制浏览器计算 duration
      const handler = () => {
        video.removeEventListener('timeupdate', handler)
        const duration = isFinite(video.duration) && video.duration > 0 ? video.duration : this.elapsed
        this.duration = duration
        this.trimStart = 0
        this.trimEnd = duration
        video.currentTime = 0
      }
      video.addEventListener('timeupdate', handler)
      try {
        video.currentTime = 1e101
      } catch (e) {
        handler()
      }
    },
    onTrimInput (which) {
      if (this.trimEnd - this.trimStart < 0.1) {
        if (which === 'start') this.trimStart = Math.max(0, this.trimEnd - 0.1)
        else this.trimEnd = Math.min(this.duration, this.trimStart + 0.1)
      }
      const video = this.$refs.preview
      if (video) video.currentTime = which === 'start' ? this.trimStart : this.trimEnd
    },
    getFfmpegPath () {
      const binName = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg'
      const candidates = []
      try {
        const resources = process.resourcesPath ||
          (remote.process && remote.process.resourcesPath)
        if (resources) {
          candidates.push(path.join(resources, binName))
          candidates.push(path.join(resources, 'app.asar.unpacked', 'node_modules', 'ffmpeg-static', binName))
        }
      } catch (e) {}
      if (process.env.FFMPEG_BIN) candidates.push(process.env.FFMPEG_BIN)
      candidates.push(path.join(process.cwd(), 'node_modules', 'ffmpeg-static', binName))
      for (const candidate of candidates) {
        try {
          if (candidate && fs.existsSync(candidate)) return candidate
        } catch (e) {}
      }
      try {
        const nodeRequire = window.require || require
        const ffmpegPath = nodeRequire('ffmpeg-static')
        if (ffmpegPath) {
          const unpacked = String(ffmpegPath).replace('app.asar', 'app.asar.unpacked')
          if (fs.existsSync(unpacked)) return unpacked
        }
      } catch (e) {}
      return 'ffmpeg'
    },
    async save () {
      if (!this._tempFile) return
      const result = await remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
        title: '保存录屏',
        defaultPath: `ZY录屏-${this.timestamp()}.mp4`,
        filters: [{ name: 'MP4 视频', extensions: ['mp4'] }]
      })
      if (result.canceled || !result.filePath) return
      let output = result.filePath
      if (!output.toLowerCase().endsWith('.mp4')) output += '.mp4'
      const trimDuration = this.trimEnd - this.trimStart
      if (trimDuration <= 0) {
        this.error = '裁切时长无效'
        return
      }
      const ffmpeg = this.getFfmpegPath()
      const args = ['-y', '-i', this._tempFile, '-ss', this.trimStart.toFixed(3), '-t', trimDuration.toFixed(3)]
      if (this.cropRect) {
        args.push('-vf', `crop=${this.cropRect.w}:${this.cropRect.h}:${this.cropRect.x}:${this.cropRect.y}`)
      }
      args.push(
        '-c:v', 'libx264',
        '-preset', this._videoWidth > 2560 ? 'ultrafast' : 'veryfast',
        '-crf', '22',
        '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart'
      )
      if (this.hasAudio) {
        args.push('-c:a', 'aac', '-b:a', '128k')
      } else {
        args.push('-an')
      }
      args.push(
        '-progress', 'pipe:1',
        '-nostats',
        output
      )
      this.step = 'saving'
      this.saving = true
      this.progress = 0
      this.error = ''
      this._saveCanceled = false
      this._savingOutput = output
      this._savingOutputExisted = fs.existsSync(output)
      const generation = ++this._saveGeneration
      let stderr = ''
      try {
        this._ffmpegProc = spawn(ffmpeg, args, { windowsHide: true })
      } catch (e) {
        this.finishSaveError(e.code === 'ENOENT' ? '未找到 ffmpeg，请安装 ffmpeg 或重新安装依赖' : '无法启动 ffmpeg：' + (e.message || e))
        return
      }
      this._ffmpegProc.stdout.on('data', chunk => {
        const text = chunk.toString()
        const match = text.match(/out_time=(\d+):(\d+):([\d.]+)/)
        if (match) {
          const seconds = Number(match[1]) * 3600 + Number(match[2]) * 60 + parseFloat(match[3])
          this.progress = Math.min(99, seconds / trimDuration * 100)
        }
      })
      this._ffmpegProc.stderr.on('data', chunk => {
        stderr += chunk.toString()
        if (stderr.length > 12000) stderr = stderr.slice(-12000)
      })
      this._ffmpegProc.on('error', err => {
        if (generation !== this._saveGeneration) return
        this.finishSaveError(err.code === 'ENOENT' ? '未找到 ffmpeg，请安装 ffmpeg 或重新安装依赖' : '无法启动 ffmpeg：' + (err.message || err))
      })
      this._ffmpegProc.on('close', code => {
        if (generation !== this._saveGeneration) return
        this._ffmpegProc = null
        if (this._saveCanceled) {
          this.removeSavingOutput()
          this.saving = false
          this.step = 'review'
          return
        }
        if (code === 0) {
          this._savingOutput = ''
          this._savingOutputExisted = false
          this.savedPath = output
          this.progress = 100
          this.saving = false
          this.step = 'done'
          this.removeTemp()
        } else {
          this.finishSaveError('转码失败：' + (stderr.split('\n').filter(Boolean).slice(-4).join('\n') || ('ffmpeg 退出码 ' + code)))
        }
      })
    },
    finishSaveError (message) {
      if (this.step !== 'saving') return
      this.removeSavingOutput()
      this.error = message
      this.saving = false
      this.step = 'review'
    },
    cancelSave () {
      this._saveCanceled = true
      if (this._ffmpegProc) {
        try { this._ffmpegProc.kill('SIGKILL') } catch (e) {}
      }
      this.saving = false
      this.step = 'review'
    },
    removeSavingOutput () {
      if (this._savingOutput) {
        // 不删除用户原有的同名文件，只清理本次新产生的不完整输出
        if (!this._savingOutputExisted) {
          try { if (fs.existsSync(this._savingOutput)) fs.unlinkSync(this._savingOutput) } catch (e) {}
        }
        this._savingOutput = ''
      }
      this._savingOutputExisted = false
    },
    retake () {
      this.removeTemp()
      this.revokePreview()
      this.previewUrl = ''
      this.duration = 0
      this.trimStart = 0
      this.trimEnd = 0
      this.cropRect = null
      this.error = ''
      this.notice = ''
      this.hasAudio = false
      this.step = 'select'
    },
    openFolder () {
      if (this.savedPath) remote.shell.showItemInFolder(this.savedPath)
    },
    registerShortcuts () {
      try {
        const api = remote.globalShortcut || electron.globalShortcut
        if (!api) return false
        const pauseOk = api.register('CommandOrControl+Alt+P', () => this.togglePause())
        const stopOk = api.register('CommandOrControl+Alt+S', () => this.stopRecording())
        if (!pauseOk || !stopOk) {
          if (pauseOk) api.unregister('CommandOrControl+Alt+P')
          if (stopOk) api.unregister('CommandOrControl+Alt+S')
          return false
        }
        this._shortcutApi = api
        return true
      } catch (e) {
        return false
      }
    },
    unregisterShortcuts () {
      if (!this._shortcutApi) return
      try {
        this._shortcutApi.unregister('CommandOrControl+Alt+P')
        this._shortcutApi.unregister('CommandOrControl+Alt+S')
      } catch (e) {}
      this._shortcutApi = null
    },
    restoreWindow () {
      if (!this._minimizedByRecord) return
      this._minimizedByRecord = false
      const win = remote.getCurrentWindow()
      if (win.isDestroyed()) return
      if (win.isMinimized()) win.restore()
      win.show()
      win.focus()
    },
    stopStream () {
      if (this._stream) {
        this._stream.getTracks().forEach(track => track.stop())
        this._stream = null
      }
    },
    revokePreview () {
      if (this.previewUrl) {
        window.URL.revokeObjectURL(this.previewUrl)
        this.previewUrl = ''
      }
    },
    removeTemp () {
      if (!this._tempFile) return
      try {
        if (fs.existsSync(this._tempFile)) fs.unlinkSync(this._tempFile)
      } catch (e) {}
      this._tempFile = ''
    },
    timestamp () {
      const d = new Date()
      const pad = n => String(n).padStart(2, '0')
      return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
    },
    formatTime (seconds) {
      const total = Math.max(0, Math.floor(seconds || 0))
      const h = Math.floor(total / 3600)
      const m = Math.floor((total % 3600) / 60)
      const s = total % 60
      const pad = n => String(n).padStart(2, '0')
      return `${pad(h)}:${pad(m)}:${pad(s)}`
    },
    close () {
      if (this.step === 'recording') {
        if (!window.confirm('正在录制，确定停止并关闭吗？')) return
      }
      if (this.step === 'saving' && !window.confirm('正在转码，确定取消并关闭吗？')) return
      this.discard()
      this.$emit('close')
    },
    discard () {
      this._recordAttempt += 1
      this.closeControlWindow()
      this.cancelCountdown()
      this.endPanelDrag()
      this.unregisterShortcuts()
      this.restoreWindow()
      this.stopTimer()
      if (this._recorder && this._recorder.state !== 'inactive') {
        this._recorder.onstop = null
        try { this._recorder.stop() } catch (e) {}
      }
      this._recorder = null
      this._chunks = []
      this.stopStream()
      if (this._ffmpegProc) {
        this._saveCanceled = true
        this._saveGeneration++
        try { this._ffmpegProc.kill('SIGKILL') } catch (e) {}
        this._ffmpegProc = null
      }
      this.removeSavingOutput()
      this.removeTemp()
      this.revokePreview()
      this.error = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.record-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3000;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
}
.record-panel {
  width: 680px;
  max-width: 94vw;
  max-height: 92vh;
  background: #1f1f1f;
  color: #eeeeee;
  border-radius: 8px;
  outline: none;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.55);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  &.compact {
    width: 380px;
    .record-body { padding: 16px; }
  }
}
.record-header {
  height: 40px;
  min-height: 40px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #262626;
  cursor: move;
  user-select: none;
  .record-title {
    font-size: 14px;
    font-weight: 600;
  }
  .record-close {
    cursor: pointer;
    font-size: 20px;
    line-height: 1;
    color: #aaa;
    &:hover { color: #fff; }
  }
}
.record-body {
  padding: 14px 16px;
  overflow-y: auto;
}
.record-body.center {
  text-align: center;
}
.countdown-number {
  font-size: 88px;
  font-weight: 700;
  line-height: 1.1;
  margin: 18px 0 4px;
  color: #e74c3c;
  font-variant-numeric: tabular-nums;
}
.record-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  &.center { justify-content: center; }
}
.tip {
  margin: 0 0 12px;
  font-size: 13px;
  color: #cccccc;
  line-height: 1.6;
  &.small { font-size: 12px; color: #999999; margin-top: 8px; }
}
.source-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.source-item {
  width: 240px;
  border: 2px solid transparent;
  border-radius: 4px;
  background: #000;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.2s;
  img {
    display: block;
    width: 100%;
    height: auto;
  }
  .source-name {
    display: block;
    padding: 6px 8px;
    font-size: 12px;
    color: #ccc;
    background: #262626;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &.active { border-color: #e74c3c; }
}
.preview-wrap {
  background: #000;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
}
.preview-box {
  position: relative;
  display: inline-block;
  max-width: 100%;
  cursor: crosshair;
  user-select: none;
  overflow: hidden;
  img {
    display: block;
    max-width: 100%;
    max-height: 52vh;
    width: auto;
    height: auto;
  }
  .selection {
    position: absolute;
    z-index: 1;
    border: 2px solid #e74c3c;
    background: rgba(231, 76, 60, 0.15);
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.45);
    pointer-events: none;
  }
}
.minimize-option {
  display: block;
  margin-top: 14px;
  font-size: 12px;
  color: #bbbbbb;
  input { margin-right: 6px; vertical-align: middle; }
}
.rec-status {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #dddddd;
}
.rec-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #e74c3c;
  margin-right: 8px;
  animation: rec-blink 1s infinite;
  &.paused { animation: none; background: #f1c40f; }
}
@keyframes rec-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.25; }
}
.timer {
  font-size: 36px;
  letter-spacing: 2px;
  margin: 14px 0 6px;
  font-family: Consolas, monospace;
}
.preview-video {
  display: block;
  width: 100%;
  max-height: 46vh;
  background: #000;
  border-radius: 4px;
}
.trim {
  margin-top: 14px;
}
.trim-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  label {
    width: 36px;
    font-size: 12px;
    color: #bbbbbb;
  }
  input[type="range"] {
    flex: 1;
    margin: 0 10px;
  }
  .trim-value {
    width: 70px;
    text-align: right;
    font-size: 12px;
    color: #dddddd;
    font-family: Consolas, monospace;
  }
}
.timeline {
  position: relative;
  height: 8px;
  border-radius: 4px;
  background: #333333;
  margin: 6px 46px 6px 46px;
  overflow: hidden;
  .timeline-range {
    position: absolute;
    top: 0;
    bottom: 0;
    background: #e74c3c;
    border-radius: 4px;
  }
}
.done-title {
  font-size: 18px;
  color: #4cd964;
  margin: 18px 0 8px;
}
.saved-path {
  font-size: 12px;
  color: #aaaaaa;
  word-break: break-all;
  margin: 0 30px;
}
.record-error {
  padding: 10px 16px;
  background: #4a1f1f;
  color: #ff8a80;
  font-size: 12px;
  white-space: pre-wrap;
  max-height: 120px;
  overflow-y: auto;
}
.record-notice {
  padding: 8px 16px;
  background: #3a3320;
  color: #f1c40f;
  font-size: 12px;
}
</style>
