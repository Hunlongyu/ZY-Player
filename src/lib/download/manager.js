const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { EventEmitter } = require('events')
const { spawn } = require('child_process')

const ACTIVE_STATUS = ['queued', 'downloading', 'merging', 'retrying']

const getFfmpegPath = () => {
  const binName = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg'
  const candidates = []
  try {
    const resources = process.resourcesPath ||
      require('@electron/remote').process.resourcesPath
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
}

const timestamp = () => {
  const d = new Date()
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}-${String(d.getMilliseconds()).padStart(3, '0')}`
}

const safeFileName = (name) => {
  return String(name || '视频')
    .replace(/[\\/:*?"<>|\r\n]/g, '_')
    .replace(/[. ]+$/, '')
    .trim()
    .slice(0, 80) || '视频'
}

class DownloadManager extends EventEmitter {
  constructor (options = {}) {
    super()
    if (options.dataDir) {
      this.dataDir = options.dataDir
    } else {
      const remote = require('@electron/remote')
      this.dataDir = path.join(remote.app.getPath('userData'), 'download-data')
    }
    this.manifestPath = path.join(this.dataDir, 'tasks.json')
    this.ffmpegPath = options.ffmpegPath || getFfmpegPath()
    this.maxConcurrent = options.maxConcurrent || 2
    this.tasks = []
    this.runtime = new Map()
    this.retryTimers = new Map()
    this._saveTimer = null
    this._emitTimer = null
    fs.mkdirSync(this.dataDir, { recursive: true })
    this._load()
  }

  getTasks () {
    return this.tasks.map(task => ({ ...task }))
  }

  getActiveCount () {
    return this.tasks.filter(task => ACTIVE_STATUS.includes(task.status)).length
  }

  getUnfinishedCount () {
    return this.tasks.filter(task => task.status !== 'completed').length
  }

  enqueue (options = {}) {
    const { url, kind, title, dir } = options
    if (!url || !dir) return null
    const existing = this.tasks.find(task => task.url === url)
    if (existing) {
      if (existing.status === 'paused' || existing.status === 'failed') this.resume(existing.id)
      return existing
    }
    try {
      fs.mkdirSync(dir, { recursive: true })
    } catch (e) {
      return null
    }
    const id = Date.now().toString(36) + crypto.randomBytes(4).toString('hex')
    const safeTitle = safeFileName(title)
    const finalPath = path.join(dir, `${safeTitle}-${timestamp()}.mp4`)
    const task = {
      id,
      url,
      kind: kind === 'hls' ? 'hls' : 'mp4',
      title: String(title || safeTitle),
      dir,
      finalPath,
      partPath: finalPath + '.part',
      tempDir: path.join(this.dataDir, 'hls-' + id),
      status: 'queued',
      progress: 0,
      downloadedBytes: 0,
      totalBytes: 0,
      segmentsTotal: 0,
      segmentsDone: 0,
      autoRetryCount: 0,
      error: '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    this.tasks.unshift(task)
    this._save(true)
    this._notify(true)
    this.pump()
    return task
  }

  pause (id) {
    const task = this.tasks.find(item => item.id === id)
    if (!task) return
    this._pauseTask(task, false)
  }

  resume (id) {
    const task = this.tasks.find(item => item.id === id)
    if (!task) return
    if (task.status === 'completed' || task.status === 'downloading' || task.status === 'merging') return
    this._clearRetryTimer(task.id)
    task.autoRetryCount = 0
    delete task._retryStartBytes
    task.status = 'queued'
    task.error = ''
    task.updatedAt = Date.now()
    this._save(true)
    this._notify(true)
    this.pump()
  }

  retry (id) {
    this.resume(id)
  }

  cancel (id) {
    const task = this.tasks.find(item => item.id === id)
    if (!task) return
    this._clearRetryTimer(task.id)
    const runtime = this.runtime.get(task.id)
    if (runtime) {
      runtime.canceled = true
      runtime.paused = true
      this._abortRuntime(runtime)
    }
    this.runtime.delete(task.id)
    this._cleanupTaskFiles(task)
    setTimeout(() => this._cleanupTaskFiles(task), 600)
    setTimeout(() => this._cleanupTaskFiles(task), 1500)
    this.tasks = this.tasks.filter(item => item.id !== task.id)
    this._save(true)
    this._notify(true)
    this.pump()
  }

  remove (id) {
    const task = this.tasks.find(item => item.id === id)
    if (!task) return
    if (task.status !== 'completed') {
      this.cancel(id)
      return
    }
    this.tasks = this.tasks.filter(item => item.id !== task.id)
    this._save(true)
    this._notify(true)
  }

  clearCompleted () {
    const before = this.tasks.length
    this.tasks = this.tasks.filter(task => task.status !== 'completed')
    if (this.tasks.length !== before) {
      this._save(true)
      this._notify(true)
    }
  }

  pauseAll () {
    this.tasks.forEach(task => {
      if (ACTIVE_STATUS.includes(task.status)) this._pauseTask(task, true)
    })
    if (this._saveTimer) {
      clearTimeout(this._saveTimer)
      this._saveTimer = null
    }
    this.saveNow()
    this._notify(true)
  }

  saveNow () {
    try {
      fs.mkdirSync(this.dataDir, { recursive: true })
      fs.writeFileSync(this.manifestPath, JSON.stringify(this.tasks, null, 2))
    } catch (e) {}
  }

  pump () {
    let slots = this.maxConcurrent - this.tasks.filter(task => ['downloading', 'merging'].includes(task.status)).length
    if (slots <= 0) return
    for (const task of this.tasks) {
      if (slots <= 0) break
      if (task.status !== 'queued') continue
      slots--
      this._start(task)
    }
  }

  _load () {
    try {
      const data = JSON.parse(fs.readFileSync(this.manifestPath, 'utf8'))
      if (Array.isArray(data)) this.tasks = data.filter(task => task && task.id)
    } catch (e) {
      this.tasks = []
    }
    let changed = false
    this.tasks = this.tasks.filter(task => task.status !== 'canceled')
    this.tasks.forEach(task => {
      if (typeof task.autoRetryCount !== 'number') task.autoRetryCount = 0
      if (ACTIVE_STATUS.includes(task.status)) {
        task.status = 'paused'
        task.updatedAt = Date.now()
        changed = true
      }
      if (task.kind === 'mp4') {
        try {
          if (fs.existsSync(task.partPath)) task.downloadedBytes = fs.statSync(task.partPath).size
        } catch (e) {}
      }
    })
    if (changed) this.saveNow()
  }

  _clearRetryTimer (id) {
    const timer = this.retryTimers.get(id)
    if (timer) {
      clearTimeout(timer)
      this.retryTimers.delete(id)
    }
  }

  _notify (force) {
    if (force) {
      if (this._emitTimer) {
        clearTimeout(this._emitTimer)
        this._emitTimer = null
      }
      this.emit('update', this.getTasks())
      return
    }
    if (this._emitTimer) return
    this._emitTimer = setTimeout(() => {
      this._emitTimer = null
      this.emit('update', this.getTasks())
    }, 250)
  }

  _save (force) {
    if (force) {
      if (this._saveTimer) {
        clearTimeout(this._saveTimer)
        this._saveTimer = null
      }
      this.saveNow()
      return
    }
    if (this._saveTimer) return
    this._saveTimer = setTimeout(() => {
      this._saveTimer = null
      this.saveNow()
    }, 800)
  }

  _start (task) {
    if (task.status === 'downloading' || task.status === 'merging') return
    try {
      fs.mkdirSync(task.dir, { recursive: true })
    } catch (e) {
      this._failTask(task, e)
      return
    }
    task.status = 'downloading'
    task.error = ''
    task.updatedAt = Date.now()
    const runtime = { controller: null, ws: null, proc: null, paused: false, canceled: false }
    this.runtime.set(task.id, runtime)
    this._save(true)
    this._notify(true)
    if (task.kind === 'hls') {
      this._runHls(task, runtime).catch(err => {
        if (runtime.paused || runtime.canceled) return
        this._failTask(task, err, runtime)
      })
    } else {
      this._runMp4(task, runtime)
    }
  }

  async _runMp4 (task, runtime) {
    let existing = 0
    try {
      existing = fs.existsSync(task.partPath) ? fs.statSync(task.partPath).size : 0
    } catch (e) {}
    task.downloadedBytes = existing
    if (task.autoRetryCount > 0) task._retryStartBytes = existing
    const controller = new AbortController()
    runtime.controller = controller
    let idleTimer = null
    let timedOut = false
    let ws = null
    const armIdle = () => {
      if (idleTimer) clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        timedOut = true
        try { controller.abort() } catch (e) {}
      }, 60000)
    }
    const cleanup = () => {
      if (idleTimer) {
        clearTimeout(idleTimer)
        idleTimer = null
      }
      if (runtime.controller === controller) runtime.controller = null
    }
    try {
      armIdle()
      const headers = { Accept: '*/*' }
      if (existing > 0) headers.Range = `bytes=${existing}-`
      const res = await fetch(task.url, {
        headers,
        signal: controller.signal,
        redirect: 'follow',
        cache: 'no-store'
      })
      if (runtime.paused || runtime.canceled) {
        cleanup()
        return
      }
      if (res.status === 416 && existing > 0) {
        if (fs.existsSync(task.finalPath)) fs.unlinkSync(task.finalPath)
        fs.renameSync(task.partPath, task.finalPath)
        cleanup()
        this._finishTask(task, runtime)
        return
      }
      if (!res.ok) throw new Error('HTTP ' + res.status)
      let append = false
      if (res.status === 206 && existing > 0) {
        append = true
      } else if (existing > 0) {
        existing = 0
        task.downloadedBytes = 0
        try { fs.truncateSync(task.partPath, 0) } catch (e) {}
      }
      const length = parseInt(res.headers.get('content-length') || '0', 10)
      task.totalBytes = length > 0 ? (append ? existing + length : length) : 0
      ws = fs.createWriteStream(task.partPath, { flags: append ? 'a' : 'w' })
      runtime.ws = ws
      const reader = res.body.getReader()
      while (true) {
        if (runtime.paused || runtime.canceled) throw new Error(runtime.paused ? 'paused' : 'canceled')
        const { done, value } = await reader.read()
        if (done) break
        if (!value || !value.byteLength) continue
        armIdle()
        await new Promise((resolve, reject) => {
          ws.write(Buffer.from(value), err => err ? reject(err) : resolve())
        })
        task.downloadedBytes += value.byteLength
        if (task.autoRetryCount > 0) {
          const retryBase = Number(task._retryStartBytes) || 0
          if (task.downloadedBytes - retryBase >= 256 * 1024) {
            task.autoRetryCount = 0
            delete task._retryStartBytes
          }
        }
        if (task.totalBytes > 0) {
          task.progress = Math.min(99, Math.floor(task.downloadedBytes / task.totalBytes * 100))
        }
        task.updatedAt = Date.now()
        this._save(false)
        this._notify(false)
      }
      await new Promise((resolve, reject) => {
        const onError = err => {
          ws.removeListener('finish', onFinish)
          reject(err)
        }
        const onFinish = () => {
          ws.removeListener('error', onError)
          resolve()
        }
        ws.once('error', onError)
        ws.once('finish', onFinish)
        ws.end()
      })
      runtime.ws = null
      cleanup()
      if (runtime.paused || runtime.canceled) return
      const size = fs.existsSync(task.partPath) ? fs.statSync(task.partPath).size : 0
      if (!size) throw new Error('下载内容为空')
      if (fs.existsSync(task.finalPath)) fs.unlinkSync(task.finalPath)
      fs.renameSync(task.partPath, task.finalPath)
      this._finishTask(task, runtime)
    } catch (err) {
      cleanup()
      if (ws) {
        try { ws.destroy() } catch (e) {}
        runtime.ws = null
      }
      if (runtime.paused || runtime.canceled) return
      this._failTask(task, timedOut ? new Error('下载超时') : err, runtime)
    }
  }

  async _runHls (task, runtime) {
    try {
      const media = await this._resolveHls(task, runtime)
      if (runtime.paused || runtime.canceled) return
      const parsed = this._parseHls(media.text, media.url)
      task.segmentsTotal = parsed.segments.length
      task.segmentsDone = 0
      task.progress = 0
      fs.mkdirSync(task.tempDir, { recursive: true })

      for (const key of parsed.keys) {
        if (runtime.paused || runtime.canceled) return
        const dest = path.join(task.tempDir, key.local)
        if (key.url.startsWith('data:')) {
          fs.writeFileSync(dest, this._decodeDataUri(key.url))
        } else {
          await this._downloadFile(key.url, dest, runtime)
        }
      }
      for (const map of parsed.maps) {
        if (runtime.paused || runtime.canceled) return
        const dest = path.join(task.tempDir, map.local)
        if (map.url.startsWith('data:')) {
          fs.writeFileSync(dest, this._decodeDataUri(map.url))
        } else {
          await this._downloadFile(map.url, dest, runtime)
        }
      }

      let done = 0
      for (const segment of parsed.segments) {
        if (runtime.paused || runtime.canceled) return
        const dest = path.join(task.tempDir, segment.file)
        let size = 0
        try { size = fs.existsSync(dest) ? fs.statSync(dest).size : 0 } catch (e) {}
        if (size <= 0) {
          await this._downloadFile(segment.url, dest, runtime)
          if (task.autoRetryCount > 0) {
            task.autoRetryCount = 0
            delete task._retryStartBytes
            this._save(false)
          }
        }
        done++
        task.segmentsDone = done
        task.progress = parsed.segments.length ? Math.min(99, Math.floor(done / parsed.segments.length * 99)) : 0
        task.updatedAt = Date.now()
        this._save(false)
        this._notify(false)
      }

      const localLines = this._buildLocalPlaylist(parsed)
      fs.writeFileSync(path.join(task.tempDir, 'local.m3u8'), localLines.join('\n') + '\n')
      if (runtime.paused || runtime.canceled) return

      task.status = 'merging'
      task.progress = 99
      task.updatedAt = Date.now()
      this._save(true)
      this._notify(true)
      await this._mergeHls(task, runtime, parsed)
      if (runtime.paused || runtime.canceled) return
      this._finishTask(task, runtime)
      try { fs.rmSync(task.tempDir, { recursive: true, force: true }) } catch (e) {}
    } catch (err) {
      if (runtime.paused || runtime.canceled) return
      this._failTask(task, err, runtime)
    }
  }

  async _resolveHls (task, runtime) {
    const text = await this._fetchText(task.url, runtime)
    if (!/#EXT-X-STREAM-INF/i.test(text)) return { text, url: task.url }
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean)
    let best = null
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (!line.startsWith('#EXT-X-STREAM-INF:')) continue
      const bandwidth = parseInt((line.match(/BANDWIDTH=(\d+)/) || [])[1] || '0', 10)
      let url = ''
      for (let j = i + 1; j < lines.length; j++) {
        if (!lines[j].startsWith('#')) {
          url = lines[j]
          break
        }
      }
      if (url && (!best || bandwidth > best.bandwidth)) best = { bandwidth, url }
    }
    if (!best) throw new Error('HLS 主播放列表没有可用清晰度')
    const mediaUrl = new URL(best.url, task.url).href
    const mediaText = await this._fetchText(mediaUrl, runtime)
    return { text: mediaText, url: mediaUrl }
  }

  _parseHls (text, baseUrl) {
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean)
    if (!lines.some(line => /^#EXT-X-ENDLIST/i.test(line))) {
      throw new Error('直播流或未结束的 HLS 不支持下载')
    }
    const keys = new Map()
    const maps = new Map()
    let keyIndex = 0
    let mapIndex = 0
    const segments = []
    for (const line of lines) {
      if (line.startsWith('#EXT-X-KEY:')) {
        const method = ((line.match(/METHOD=([^,]+)/) || [])[1] || '').toUpperCase()
        if (method && method !== 'NONE' && method !== 'AES-128') {
          throw new Error('不支持的 HLS 加密方式：' + method)
        }
        if (method === 'AES-128') {
          const uri = (line.match(/URI="([^"]*)"/) || [])[1]
          if (!uri) throw new Error('HLS 密钥地址缺失')
          const resolved = new URL(uri, baseUrl).href
          if (!keys.has(resolved)) {
            keys.set(resolved, { url: resolved, local: `key-${keyIndex++}.bin` })
          }
        }
      } else if (line.startsWith('#EXT-X-MAP:')) {
        const uri = (line.match(/URI="([^"]*)"/) || [])[1]
        if (uri) {
          const resolved = new URL(uri, baseUrl).href
          if (!maps.has(resolved)) {
            maps.set(resolved, { url: resolved, local: `init-${mapIndex++}${this._extFromUrl(resolved, '.mp4')}` })
          }
        }
      } else if (!line.startsWith('#')) {
        const resolved = new URL(line, baseUrl).href
        segments.push({
          url: resolved,
          file: `seg-${String(segments.length).padStart(5, '0')}${this._extFromUrl(resolved, '.ts')}`
        })
      }
    }
    if (!segments.length) throw new Error('HLS 播放列表中没有分片')
    return {
      text,
      baseUrl,
      lines,
      keys: [...keys.values()],
      maps: [...maps.values()],
      segments
    }
  }

  _buildLocalPlaylist (parsed) {
    const keyMap = new Map(parsed.keys.map(key => [key.url, key.local]))
    const mapMap = new Map(parsed.maps.map(map => [map.url, map.local]))
    let segmentIndex = 0
    return parsed.lines.map(line => {
      if (line.startsWith('#EXT-X-KEY:')) {
        const uri = (line.match(/URI="([^"]*)"/) || [])[1]
        if (uri) {
          const resolved = new URL(uri, parsed.baseUrl).href
          if (keyMap.has(resolved)) return line.replace(/URI="[^"]*"/, `URI="${keyMap.get(resolved)}"`)
        }
        return line
      }
      if (line.startsWith('#EXT-X-MAP:')) {
        const uri = (line.match(/URI="([^"]*)"/) || [])[1]
        if (uri) {
          const resolved = new URL(uri, parsed.baseUrl).href
          if (mapMap.has(resolved)) return line.replace(/URI="[^"]*"/, `URI="${mapMap.get(resolved)}"`)
        }
        return line
      }
      if (line.startsWith('#')) return line
      const segment = parsed.segments[segmentIndex++]
      return segment ? segment.file : line
    })
  }

  _mergeHls (task, runtime, parsed) {
    return new Promise((resolve, reject) => {
      const hasTs = parsed.segments.some(segment => segment.file.endsWith('.ts'))
      const args = ['-y', '-allowed_extensions', 'ALL', '-protocol_whitelist', 'file,crypto,data', '-i', 'local.m3u8', '-c', 'copy']
      if (hasTs) args.push('-bsf:a', 'aac_adtstoasc')
      if (task.finalPath.toLowerCase().endsWith('.mp4')) args.push('-movflags', '+faststart')
      args.push(task.finalPath)
      let proc
      try {
        proc = spawn(this.ffmpegPath, args, { cwd: task.tempDir, windowsHide: true })
      } catch (e) {
        reject(e)
        return
      }
      runtime.proc = proc
      let stderr = ''
      proc.stderr.on('data', chunk => {
        stderr += chunk.toString()
        if (stderr.length > 8000) stderr = stderr.slice(-8000)
      })
      proc.on('error', err => {
        runtime.proc = null
        if (runtime.paused || runtime.canceled) return reject(new Error('paused'))
        reject(err)
      })
      proc.on('close', code => {
        runtime.proc = null
        if (runtime.paused || runtime.canceled) return reject(new Error('paused'))
        let size = 0
        try { size = fs.existsSync(task.finalPath) ? fs.statSync(task.finalPath).size : 0 } catch (e) {}
        if (code === 0 && size > 0) return resolve()
        const canConcat = parsed.keys.length === 0 && parsed.segments.every(segment => segment.file.endsWith('.ts'))
        if (canConcat) {
          try { if (fs.existsSync(task.finalPath)) fs.unlinkSync(task.finalPath) } catch (e) {}
          const tsPath = task.finalPath.replace(/\.mp4$/i, '.ts')
          this._concatTs(parsed.segments.map(segment => path.join(task.tempDir, segment.file)), tsPath, runtime)
            .then(() => {
              task.finalPath = tsPath
              resolve()
            })
            .catch(reject)
          return
        }
        reject(new Error(stderr.split('\n').filter(Boolean).slice(-2).join(' ') || ('ffmpeg 退出码 ' + code)))
      })
    })
  }

  _concatTs (files, output, runtime) {
    return new Promise((resolve, reject) => {
      const out = fs.createWriteStream(output)
      let index = 0
      const next = () => {
        if (runtime.paused || runtime.canceled) {
          out.destroy()
          return reject(new Error(runtime.paused ? 'paused' : 'canceled'))
        }
        if (index >= files.length) {
          out.end(resolve)
          return
        }
        const reader = fs.createReadStream(files[index++])
        reader.on('error', err => {
          out.destroy()
          reject(err)
        })
        reader.on('end', next)
        reader.pipe(out, { end: false })
      }
      next()
    })
  }

  async _fetchText (url, runtime) {
    if (runtime.paused || runtime.canceled) throw new Error(runtime.paused ? 'paused' : 'canceled')
    const controller = new AbortController()
    runtime.controller = controller
    let timedOut = false
    const timer = setTimeout(() => {
      timedOut = true
      try { controller.abort() } catch (e) {}
    }, 30000)
    try {
      const res = await fetch(url, {
        headers: { Accept: '*/*' },
        signal: controller.signal,
        redirect: 'follow',
        cache: 'no-store'
      })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const text = await res.text()
      if (runtime.paused || runtime.canceled) throw new Error(runtime.paused ? 'paused' : 'canceled')
      return String(text || '').replace(/^\uFEFF/, '')
    } catch (err) {
      if (runtime.paused || runtime.canceled) throw new Error(runtime.paused ? 'paused' : 'canceled')
      if (timedOut) throw new Error('请求超时')
      throw err
    } finally {
      clearTimeout(timer)
      if (runtime.controller === controller) runtime.controller = null
    }
  }

  _downloadFile (url, dest, runtime) {
    return new Promise((resolve, reject) => {
      let attempt = 0
      const run = async () => {
        if (runtime.paused || runtime.canceled) return reject(new Error(runtime.paused ? 'paused' : 'canceled'))
        const part = dest + '.part'
        try { fs.mkdirSync(path.dirname(dest), { recursive: true }) } catch (e) {}
        const controller = new AbortController()
        runtime.controller = controller
        let timedOut = false
        let idleTimer = null
        let ws = null
        const armIdle = () => {
          if (idleTimer) clearTimeout(idleTimer)
          idleTimer = setTimeout(() => {
            timedOut = true
            try { controller.abort() } catch (e) {}
          }, 60000)
        }
        const cleanup = () => {
          if (idleTimer) {
            clearTimeout(idleTimer)
            idleTimer = null
          }
          if (runtime.controller === controller) runtime.controller = null
        }
        const fail = err => {
          cleanup()
          if (ws) {
            try { ws.destroy() } catch (e) {}
            runtime.ws = null
          }
          try { if (fs.existsSync(part)) fs.unlinkSync(part) } catch (e) {}
          if (runtime.paused || runtime.canceled) return reject(new Error(runtime.paused ? 'paused' : 'canceled'))
          if (attempt < 2) {
            attempt++
            setTimeout(run, 500)
            return
          }
          reject(timedOut ? new Error('下载超时') : err)
        }
        try {
          armIdle()
          const res = await fetch(url, {
            headers: { Accept: '*/*' },
            signal: controller.signal,
            redirect: 'follow',
            cache: 'no-store'
          })
          if (!res.ok) throw new Error('HTTP ' + res.status)
          ws = fs.createWriteStream(part)
          runtime.ws = ws
          const reader = res.body.getReader()
          while (true) {
            if (runtime.paused || runtime.canceled) throw new Error(runtime.paused ? 'paused' : 'canceled')
            const { done, value } = await reader.read()
            if (done) break
            if (!value || !value.byteLength) continue
            armIdle()
            await new Promise((resolveWrite, rejectWrite) => {
              ws.write(Buffer.from(value), err => err ? rejectWrite(err) : resolveWrite())
            })
          }
          await new Promise((resolveEnd, rejectEnd) => {
            const onError = err => {
              ws.removeListener('finish', onFinish)
              rejectEnd(err)
            }
            const onFinish = () => {
              ws.removeListener('error', onError)
              resolveEnd()
            }
            ws.once('error', onError)
            ws.once('finish', onFinish)
            ws.end()
          })
          runtime.ws = null
          cleanup()
          if (runtime.paused || runtime.canceled) throw new Error(runtime.paused ? 'paused' : 'canceled')
          fs.renameSync(part, dest)
          resolve()
        } catch (err) {
          fail(err)
        }
      }
      run()
    })
  }

  _pauseTask (task, silent) {
    if (!ACTIVE_STATUS.includes(task.status)) return
    this._clearRetryTimer(task.id)
    const runtime = this.runtime.get(task.id)
    if (runtime) {
      runtime.paused = true
      this._abortRuntime(runtime)
      if (task.kind === 'mp4') {
        try {
          if (fs.existsSync(task.partPath)) task.downloadedBytes = fs.statSync(task.partPath).size
        } catch (e) {}
      }
      this.runtime.delete(task.id)
    }
    task.status = 'paused'
    task.updatedAt = Date.now()
    this._save(true)
    if (!silent) {
      this._notify(true)
      this.pump()
    }
  }

  _abortRuntime (runtime) {
    if (runtime.controller) {
      try { runtime.controller.abort() } catch (e) {}
      runtime.controller = null
    }
    if (runtime.ws) {
      try { runtime.ws.destroy() } catch (e) {}
      runtime.ws = null
    }
    if (runtime.proc) {
      try { runtime.proc.kill('SIGKILL') } catch (e) {}
      runtime.proc = null
    }
  }

  _finishTask (task, runtime) {
    this.runtime.delete(task.id)
    this._clearRetryTimer(task.id)
    task.autoRetryCount = 0
    delete task._retryStartBytes
    task.status = 'completed'
    task.progress = 100
    task.error = ''
    task.updatedAt = Date.now()
    this._save(true)
    this._notify(true)
    this.pump()
  }

  _failTask (task, err, runtime) {
    if (!['queued', 'downloading', 'merging'].includes(task.status)) return
    if (runtime) this.runtime.delete(task.id)
    if (typeof task.autoRetryCount !== 'number') task.autoRetryCount = 0
    const message = String((err && err.message) || err || '下载失败').slice(0, 300)
    task.updatedAt = Date.now()
    if (task.autoRetryCount < 3) {
      task.autoRetryCount += 1
      task.status = 'retrying'
      task.error = `第 ${task.autoRetryCount}/3 次自动重试：${message}`
      this._save(true)
      this._notify(true)
      const delay = Math.min(5000, 1000 * task.autoRetryCount)
      const timer = setTimeout(() => {
        this.retryTimers.delete(task.id)
        if (!this.tasks.includes(task) || task.status !== 'retrying') return
        task.status = 'queued'
        task.error = ''
        task.updatedAt = Date.now()
        this._save(true)
        this._notify(true)
        this.pump()
      }, delay)
      this.retryTimers.set(task.id, timer)
      this.pump()
      return
    }
    this.emit('auto-canceled', { id: task.id, title: task.title })
    this.cancel(task.id)
  }

  _cleanupTaskFiles (task) {
    try { if (task.partPath && fs.existsSync(task.partPath)) fs.unlinkSync(task.partPath) } catch (e) {}
    try { if (task.tempDir && fs.existsSync(task.tempDir)) fs.rmSync(task.tempDir, { recursive: true, force: true }) } catch (e) {}
    try { if (task.finalPath && fs.existsSync(task.finalPath)) fs.unlinkSync(task.finalPath) } catch (e) {}
    const tsPath = task.finalPath ? task.finalPath.replace(/\.mp4$/i, '.ts') : ''
    try { if (tsPath && tsPath !== task.finalPath && fs.existsSync(tsPath)) fs.unlinkSync(tsPath) } catch (e) {}
  }

  _extFromUrl (url, fallback) {
    try {
      const pathname = new URL(url).pathname
      const match = pathname.match(/(\.[a-z0-9]{1,5})$/i)
      return match ? match[1].toLowerCase() : fallback
    } catch (e) {
      return fallback
    }
  }

  _decodeDataUri (uri) {
    const match = uri.match(/^data:([^,]*?),(.*)$/s)
    if (!match) throw new Error('无效的 data URI 密钥')
    if (/;base64/i.test(match[1])) return Buffer.from(match[2], 'base64')
    return Buffer.from(decodeURIComponent(match[2]), 'utf8')
  }
}

let instance = null

const getDownloadManager = (options) => {
  if (!instance) instance = new DownloadManager(options)
  return instance
}

module.exports = { DownloadManager, getDownloadManager, getFfmpegPath }
