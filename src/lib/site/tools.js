import { sites, setting } from '../dexie'
import axios from 'axios'
import parser from 'fast-xml-parser'
import cheerio from 'cheerio'
import { Parser as M3u8Parser } from 'm3u8-parser'

// axios使用系统代理  https://evandontje.com/2020/04/02/automatic-system-proxy-configuration-for-electron-applications/
// xgplayer使用chromium代理设置，浏览器又默认使用系统代理 https://www.chromium.org/developers/design-documents/network-settings
// 要在设置中添加代理设置，可参考https://stackoverflow.com/questions/37393248/how-connect-to-proxy-in-electron-webview
var http = require('http')
var https = require('http')
const { remote } = require('electron')
var win = remote.getCurrentWindow()
var session = win.webContents.session
var ElectronProxyAgent = require('electron-proxy-agent')

// 请求超时时限
axios.defaults.timeout = 10000 // 可能使用代理，增长超时

// 重试次数，共请求3次
axios.defaults.retry = 2

// 请求的间隙
axios.defaults.retryDelay = 1000

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做些事
  if (response.status && response.status === 200 && response.request.responseURL.includes('api.php') && !response.data.startsWith('<?xml')) {
  }
  return response
}, function (err) { // 请求错误时做些事
  // 请求超时的之后，抛出 err.code = ECONNABORTED的错误..错误信息是 timeout of  xxx ms exceeded
  if (err.code === 'ECONNABORTED' && err.message.indexOf('timeout') !== -1) {
    var config = err.config
    config.__retryCount = config.__retryCount || 0

    if (config.__retryCount >= config.retry) {
      err.message = '多次请求均超时'
      return Promise.reject(err)
    }

    config.__retryCount += 1

    var backoff = new Promise(function (resolve) {
      setTimeout(function () {
        resolve()
      }, config.retryDelay || 1)
    })

    return backoff.then(function () {
      return axios(config)
    })
  } else {
    if (err && !err.response) {
      err.message = '连接服务器失败!'
    }
    return Promise.reject(err)
  }
})

const zy = {
  xmlConfig: { // XML 转 JSON 配置
    trimValues: true,
    textNodeName: '_t',
    ignoreAttributes: false,
    attributeNamePrefix: '_',
    parseAttributeValue: true
  },
  getSite (key) {
    return new Promise((resolve, reject) => {
      sites.all().then(res => {
        for (const i of res) {
          if (key === i.key) {
            resolve(i)
          }
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  /**
   * 获取资源分类 和 所有资源的总数, 分页等信息
   * @param {*} key 资源网 key
   * @returns
   */
  class (key) {
    return new Promise((resolve, reject) => {
      this.getSite(key).then(res => {
        const url = res.api
        axios.post(url).then(res => {
          const data = res.data
          const json = parser.parse(data, this.xmlConfig)
          const jsondata = json.rss === undefined ? json : json.rss
          const arr = []
          if (jsondata.class) {
            for (const i of jsondata.class.ty) {
              const j = {
                tid: i._id,
                name: i._t
              }
              arr.push(j)
            }
          }
          const doc = {
            class: arr,
            page: jsondata.list._page,
            pagecount: jsondata.list._pagecount,
            pagesize: jsondata.list._pagesize,
            recordcount: jsondata.list._recordcount
          }
          resolve(doc)
        }).catch(err => {
          reject(err)
        })
      })
    })
  },
  /**
   * 获取资源列表
   * @param {*} key 资源网 key
   * @param {number} [pg=1] 翻页 page
   * @param {*} t 分类 type
   * @returns
   */
  list (key, pg = 1, t) {
    return new Promise((resolve, reject) => {
      this.getSite(key).then(res => {
        const site = res
        let url = null
        if (t) {
          url = `${site.api}?ac=videolist&t=${t}&pg=${pg}`
        } else {
          url = `${site.api}?ac=videolist&pg=${pg}`
        }
        axios.post(url).then(async res => {
          const data = res.data
          const json = parser.parse(data, this.xmlConfig)
          const jsondata = json.rss === undefined ? json : json.rss
          const videoList = jsondata.list.video
          resolve(videoList)
        }).catch(err => {
          reject(err)
        })
      })
    })
  },
  /**
   * 获取总资源数, 以及页数
   * @param {*} key 资源网
   * @param {*} t 分类 type
   * @returns page object
   */
  page (key, t) {
    return new Promise((resolve, reject) => {
      this.getSite(key).then(res => {
        const site = res
        let url = ''
        if (t) {
          url = `${site.api}?ac=videolist&t=${t}`
        } else {
          url = `${site.api}?ac=videolist`
        }
        axios.post(url).then(async res => {
          const data = res.data
          const json = parser.parse(data, this.xmlConfig)
          const jsondata = json.rss === undefined ? json : json.rss
          const pg = {
            page: jsondata.list._page,
            pagecount: jsondata.list._pagecount,
            pagesize: jsondata.list._pagesize,
            recordcount: jsondata.list._recordcount
          }
          resolve(pg)
        }).catch(err => {
          reject(err)
        })
      })
    })
  },
  /**
   * 搜索资源
   * @param {*} key 资源网 key
   * @param {*} wd 搜索关键字
   * @returns
   */
  search (key, wd) {
    return new Promise((resolve, reject) => {
      this.getSite(key).then(res => {
        const site = res
        wd = encodeURI(wd)
        var url = `${site.api}?wd=${wd}`
        axios.post(url, { timeout: 3000 }).then(res => {
          const data = res.data
          const json = parser.parse(data, this.xmlConfig)
          const jsondata = json.rss === undefined ? json : json.rss
          if (json && jsondata && jsondata.list) {
            const videoList = jsondata.list.video
            resolve(videoList)
          }
        }).catch(err => {
          reject(err)
        })
      }).catch(err => {
        reject(err)
      })
    })
  },
  /**
   * 获取资源详情
   * @param {*} key 资源网 key
   * @param {*} id 资源唯一标识符 id
   * @returns
   */
  detail (key, id) {
    return new Promise((resolve, reject) => {
      this.getSite(key).then(res => {
        const url = `${res.api}?ac=videolist&ids=${id}`
        axios.post(url).then(res => {
          const data = res.data
          const json = parser.parse(data, this.xmlConfig)
          const jsondata = json.rss === undefined ? json : json.rss
          const videoList = jsondata.list.video
          // Parse m3u8List
          var m3u8List = []
          const dd = videoList.dl.dd
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
          videoList.m3u8List = m3u8List
          resolve(videoList)
        }).catch(err => {
          reject(err)
        })
      }).catch(err => {
        reject(err)
      })
    })
  },
  /**
   * 下载资源
   * @param {*} key 资源网 key
   * @param {*} id 资源唯一标识符 id
   * @returns
   */
  download (key, id) {
    return new Promise((resolve, reject) => {
      this.getSite(key).then(res => {
        const site = res
        if (site.download) {
          const url = `${site.download}?ac=videolist&ids=${id}&ct=1`
          axios.post(url).then(res => {
            const data = res.data
            const json = parser.parse(data, this.xmlConfig)
            const jsondata = json.rss === undefined ? json : json.rss
            const videoList = jsondata.list.video
            resolve(videoList)
          }).catch(err => {
            reject(err)
          })
        } else {
          resolve([])
        }
      })
    })
  },
  /**
   * 检查资源
   * @param {*} key 资源网 key
   * @returns boolean
   */
  async check (key, id) {
    try {
      const cls = await this.class(key)
      if (cls) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  },
  /**
   * 检查直播源
   * @param {*} channel 直播频道 url
   * @returns boolean
   */
  async checkChannel (channel) {
    return new Promise((resolve, reject) => {
      axios.get(channel).then(res => {
        const manifest = res.data
        var parser = new M3u8Parser()
        parser.push(manifest)
        parser.end()
        var parsedManifest = parser.manifest
        if (parsedManifest.segments.length) {
          resolve(true)
        } else {
          resolve(false)
        }
      }).catch(e => {
        resolve(false)
      })
    })
  },
  /**
   * 获取豆瓣页面链接
   * @param {*} name 视频名称
   * @returns 豆瓣页面链接，如果没有搜到该视频，返回搜索页面链接
   */
  doubanLink (name) {
    return new Promise((resolve, reject) => {
      // 豆瓣搜索链接
      var nameToSearch = name.replace(/\s/g, '')
      var doubanSearchLink = 'https://www.douban.com/search?q=' + nameToSearch
      axios.get(doubanSearchLink).then(res => {
        const $ = cheerio.load(res.data)
        // 比较第一和第二给豆瓣搜索结果, 看名字是否相符
        var link = ''
        var linkInDouban = $($('div.result')[0]).find('div>div>h3>a').first()
        var nameInDouban = linkInDouban.text().replace(/\s/g, '')
        if (nameToSearch === nameInDouban) {
          link = linkInDouban.attr('href')
        } else {
          linkInDouban = $($('div.result')[1]).find('div>div>h3>a').first()
          nameInDouban = linkInDouban.text().replace(/\s/g, '')
          if (nameToSearch === nameInDouban) {
            link = linkInDouban.attr('href')
          }
        }
        if (link) {
          resolve(link)
        } else {
          // 如果没找到符合的链接，返回搜索页面
          resolve(doubanSearchLink)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  /**
   * 获取豆瓣评分
   * @param {*} name 视频名称
   * @returns 豆瓣评分
   */
  doubanRate (name) {
    return new Promise((resolve, reject) => {
      var nameToSearch = name.replace(/\s/g, '')
      this.doubanLink(nameToSearch).then(link => {
        if (link.includes('https://www.douban.com/search')) {
          resolve('暂无评分')
        } else {
          axios.get(link).then(response => {
            const parsedHtml = cheerio.load(response.data)
            var rating = parsedHtml('body').find('#interest_sectl').first().find('strong').first()
            if (rating.text()) {
              resolve(rating.text().replace(/\s/g, ''))
            } else {
              resolve('暂无评分')
            }
          }).catch(err => {
            reject(err)
          })
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  async proxy () {
    return new Promise((resolve, reject) => {
      setting.find().then(db => {
        if (db.proxy) {
          if (db.proxy.type === 'none') {
            session.setProxy({ proxyRules: 'direct://' })
            http.globalAgent = https.globalAgent = new ElectronProxyAgent(session)
          } else if (db.proxy.type === 'manual') {
            if (db.proxy.scheme && db.proxy.url && db.proxy.port) {
              const proxyURL = db.proxy.scheme + '://' + db.proxy.url.trim() + ':' + db.proxy.port.trim()
              session.setProxy({ proxyRules: proxyURL })
              http.globalAgent = https.globalAgent = new ElectronProxyAgent(session)
            }
          }
        }
        // 不要删了，留着测试用
        // axios.get('https://api.my-ip.io/ip').then(res => console.log(res))
      })
    })
  }
}

zy.proxy()

export default zy
