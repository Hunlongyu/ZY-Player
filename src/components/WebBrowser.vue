<template>
  <div class="web-browser" :class="themeClass">
    <div class="wb-toolbar">
      <button class="wb-icon-btn" :disabled="!canBack" @click="goBack" title="后退">←</button>
      <button class="wb-icon-btn" :disabled="!canForward" @click="goForward" title="前进">→</button>
      <button class="wb-icon-btn" @click="reload" title="刷新">⟳</button>
      <input
        ref="urlInput"
        class="wb-input"
        v-model.trim="urlInput"
        placeholder="输入网址，例如 https://www.example.com"
        @keyup.enter="go">
      <button class="wb-btn primary" @click="go">打开</button>
      <button class="wb-btn" :class="{ active: mobile }" @click="toggleMode" :title="mobile ? '切换到 PC 模式' : '切换到手机模式'">
        {{ mobile ? '手机模式' : 'PC 模式' }}
      </button>
      <button class="wb-btn" :disabled="!currentUrl" @click="openExternal" title="在系统浏览器中打开">系统浏览器</button>
      <span class="wb-loading" v-if="loading">加载中…</span>
    </div>
    <div class="wb-body" :class="{ mobile }">
      <div class="wb-frame">
        <webview
          ref="webview"
          class="wb-webview"
          src="about:blank"
          allowpopups
          webpreferences="nodeIntegration=no,contextIsolation=yes,webSecurity=yes">
        </webview>
        <div class="wb-empty" v-if="!currentUrl && !errorMessage">
          <p>输入网址开始浏览</p>
          <p class="wb-empty-tip">支持 PC 模式 / 手机模式切换</p>
        </div>
        <div class="wb-error" v-if="errorMessage">
          <p class="wb-error-msg">{{ errorMessage }}</p>
          <button class="wb-btn primary" @click="retry">重试</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const remote = require('@electron/remote')

// Electron 13 使用 Chromium 91，UA 版本保持接近，避免站点下发不兼容的新语法
const PC_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537.36'
const MOBILE_USER_AGENT = 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Mobile Safari/537.36'

export default {
  name: 'web-browser',
  data () {
    return {
      urlInput: '',
      currentUrl: '',
      loading: false,
      errorMessage: '',
      mobile: false,
      canBack: false,
      canForward: false
    }
  },
  computed: {
    themeClass () {
      const theme = this.$store.getters.getSetting.theme
      if (theme === 'dark') return 'wb-dark'
      if (theme === 'green' || theme === 'pink') return 'wb-colored'
      return 'wb-light'
    },
    view () {
      return this.$store.getters.getView
    }
  },
  watch: {
    view (val) {
      if (val === 'WebBrowser') {
        this.$nextTick(() => {
          if (this.$refs.urlInput) this.$refs.urlInput.focus()
        })
      }
    }
  },
  created () {
    this.pendingUrl = ''
    this._eventHandlers = null
    const savedUrl = localStorage.getItem('zy-browser-url') || ''
    const savedMobile = localStorage.getItem('zy-browser-mobile') === '1'
    this.mobile = savedMobile
    this.urlInput = savedUrl
    this.pendingUrl = savedUrl
  },
  mounted () {
    this.$nextTick(() => {
      this.bindWebviewEvents()
      this.applyUserAgent()
      if (this.pendingUrl) {
        const url = this.pendingUrl
        this.pendingUrl = ''
        this.navigate(url)
      } else {
        this.updateNavState()
      }
      if (this.$refs.urlInput) this.$refs.urlInput.focus()
    })
  },
  beforeDestroy () {
    this.unbindWebviewEvents()
    this.pendingUrl = ''
  },
  methods: {
    bindWebviewEvents () {
      const webview = this.$refs.webview
      if (!webview) return
      this._eventHandlers = {
        'dom-ready': this.onDomReady,
        'did-start-loading': this.onStartLoading,
        'did-stop-loading': this.onStopLoading,
        'did-navigate': this.onNavigate,
        'did-navigate-in-page': this.onNavigateInPage,
        'did-fail-load': this.onFailLoad,
        'new-window': this.onNewWindow,
        'will-navigate': this.onWillNavigate
      }
      Object.keys(this._eventHandlers).forEach(name => {
        webview.addEventListener(name, this._eventHandlers[name])
      })
    },
    unbindWebviewEvents () {
      const webview = this.$refs.webview
      if (!webview || !this._eventHandlers) return
      Object.keys(this._eventHandlers).forEach(name => {
        webview.removeEventListener(name, this._eventHandlers[name])
      })
      this._eventHandlers = null
    },
    onDomReady () {
      this.applyUserAgent()
      this.updateNavState()
      if (this.pendingUrl) {
        const url = this.pendingUrl
        this.pendingUrl = ''
        this.navigate(url)
      }
    },
    applyUserAgent () {
      const webview = this.$refs.webview
      if (!webview) return
      try {
        webview.setUserAgent(this.mobile ? MOBILE_USER_AGENT : PC_USER_AGENT)
      } catch (e) {}
    },
    go () {
      this.navigate(this.urlInput)
    },
    normalizeUrl (input) {
      let value = String(input || '').trim()
      if (!value) return ''
      if (!/^[a-z][a-z0-9+.-]*:/i.test(value)) value = 'https://' + value
      try {
        const url = new URL(value)
        if (!['http:', 'https:'].includes(url.protocol)) {
          this.$message.warning('只支持 http/https 网页')
          return ''
        }
        if (!url.hostname) {
          this.$message.warning('请输入有效的网址')
          return ''
        }
        return url.href
      } catch (e) {
        this.$message.warning('请输入有效的网址')
        return ''
      }
    },
    navigate (input) {
      const url = this.normalizeUrl(input)
      if (!url) return
      this.errorMessage = ''
      this.currentUrl = url
      this.urlInput = url
      localStorage.setItem('zy-browser-url', url)
      const webview = this.$refs.webview
      if (!webview) {
        this.pendingUrl = url
        return
      }
      try {
        this.loading = true
        const result = webview.loadURL(url)
        if (result && result.catch) result.catch(() => {})
      } catch (e) {
        // WebView 尚未 attach 或 dom-ready 时 loadURL 会抛错，退化为设置 src
        try {
          webview.setAttribute('src', url)
        } catch (e2) {
          this.loading = false
          this.errorMessage = '打开失败：' + (e.message || e)
        }
      }
    },
    onStartLoading () {
      this.loading = true
      this.errorMessage = ''
    },
    onStopLoading () {
      this.loading = false
      this.updateNavState()
    },
    onNavigate (event) {
      if (!event.url || !/^https?:\/\//i.test(event.url)) return
      this.currentUrl = event.url
      this.urlInput = event.url
      this.errorMessage = ''
      localStorage.setItem('zy-browser-url', event.url)
      this.updateNavState()
    },
    onNavigateInPage (event) {
      if (event.isMainFrame === false) return
      this.onNavigate(event)
    },
    onFailLoad (event) {
      if (event.errorCode === -3) return
      if (event.isMainFrame === false) return
      if (!this.currentUrl) return
      this.loading = false
      this.errorMessage = (event.errorDescription || '页面加载失败') + ' (' + event.errorCode + ')'
    },
    onNewWindow (event) {
      event.preventDefault()
      if (!event.url) return
      if (/^https?:\/\//i.test(event.url)) {
        this.navigate(event.url)
      } else if (/^(mailto:|tel:)/i.test(event.url)) {
        remote.shell.openExternal(event.url)
      }
    },
    onWillNavigate (event) {
      if (!event.url || event.url === 'about:blank') return
      if (/^https?:\/\//i.test(event.url)) return
      event.preventDefault()
      if (/^(mailto:|tel:)/i.test(event.url)) {
        remote.shell.openExternal(event.url)
      }
    },
    goBack () {
      const webview = this.$refs.webview
      if (!webview) return
      try {
        if (webview.canGoBack()) webview.goBack()
      } catch (e) {}
    },
    goForward () {
      const webview = this.$refs.webview
      if (!webview) return
      try {
        if (webview.canGoForward()) webview.goForward()
      } catch (e) {}
    },
    reload () {
      if (!this.currentUrl) return
      const webview = this.$refs.webview
      if (!webview) return
      try {
        this.errorMessage = ''
        webview.reload()
      } catch (e) {
        this.navigate(this.currentUrl)
      }
    },
    retry () {
      this.errorMessage = ''
      this.reload()
    },
    updateNavState () {
      const webview = this.$refs.webview
      if (!webview) return
      try {
        this.canBack = webview.canGoBack()
        this.canForward = webview.canGoForward()
      } catch (e) {}
    },
    toggleMode () {
      this.mobile = !this.mobile
      localStorage.setItem('zy-browser-mobile', this.mobile ? '1' : '0')
      this.applyUserAgent()
      this.$nextTick(() => {
        if (!this.currentUrl) return
        this.navigate(this.currentUrl)
      })
    },
    openExternal () {
      if (this.currentUrl) remote.shell.openExternal(this.currentUrl)
    }
  }
}
</script>

<style lang="scss" scoped>
.web-browser {
  --wb-panel: #ffffff;
  --wb-text: #333333;
  --wb-border: rgba(0, 0, 0, 0.12);
  --wb-input-bg: #ffffff;
  --wb-input-text: #333333;
  height: calc(100% - 40px);
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  color: #333333;
  &.wb-dark {
    --wb-panel: #2b2b2b;
    --wb-text: #dddddd;
    --wb-border: rgba(255, 255, 255, 0.12);
    --wb-input-bg: #242424;
    --wb-input-text: #eeeeee;
    color: #dddddd;
  }
  &.wb-colored {
    --wb-panel: rgba(0, 0, 0, 0.18);
    --wb-text: #ffffff;
    --wb-border: rgba(255, 255, 255, 0.25);
    --wb-input-bg: rgba(0, 0, 0, 0.18);
    --wb-input-text: #ffffff;
    color: #ffffff;
  }
}
.wb-toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}
.wb-icon-btn {
  width: 34px;
  height: 34px;
  padding: 0;
  border-radius: 4px;
  border: 1px solid var(--wb-border);
  background: var(--wb-panel);
  color: var(--wb-text);
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  &:hover:not(:disabled) {
    border-color: #409eff;
    color: #409eff;
  }
  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
}
.wb-input {
  flex: 1;
  min-width: 240px;
  max-width: 720px;
  height: 34px;
  padding: 0 12px;
  border-radius: 4px;
  border: 1px solid var(--wb-border);
  background: var(--wb-input-bg);
  color: var(--wb-input-text);
  outline: none;
  box-sizing: border-box;
  &::placeholder {
    color: var(--wb-input-text);
    opacity: 0.55;
  }
  &:focus {
    border-color: #409eff;
  }
}
.wb-btn {
  height: 34px;
  padding: 0 14px;
  border-radius: 4px;
  border: 1px solid var(--wb-border);
  background: var(--wb-panel);
  color: var(--wb-text);
  cursor: pointer;
  outline: none;
  white-space: nowrap;
  &:hover:not(:disabled) {
    border-color: #409eff;
    color: #409eff;
  }
  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
  &.primary {
    background: #409eff;
    border-color: #409eff;
    color: #ffffff;
    &:hover:not(:disabled) {
      background: #66b1ff;
      border-color: #66b1ff;
      color: #ffffff;
    }
  }
  &.active {
    border-color: #409eff;
    color: #409eff;
  }
}
.wb-loading {
  font-size: 12px;
  opacity: 0.7;
  white-space: nowrap;
}
.wb-body {
  flex: 1;
  min-height: 0;
  display: flex;
  justify-content: center;
  align-items: stretch;
}
.wb-frame {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;
  background: #ffffff;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  transition: width 0.2s ease;
}
.wb-body.mobile .wb-frame {
  width: 390px;
  max-width: 100%;
  border: 8px solid #1b1b1b;
  border-radius: 24px;
  box-sizing: border-box;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
}
.wb-webview {
  display: flex;
  width: 100%;
  height: 100%;
}
.wb-empty,
.wb-error {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px;
  color: #888888;
  font-size: 14px;
  line-height: 1.8;
  p {
    margin: 0;
  }
  .wb-empty-tip {
    font-size: 12px;
    opacity: 0.7;
    margin-top: 6px;
  }
}
.wb-empty {
  pointer-events: none;
}
.wb-error {
  background: rgba(255, 255, 255, 0.94);
  color: #c0392b;
  .wb-error-msg {
    margin-bottom: 14px;
    word-break: break-all;
  }
}
</style>
