import { sites } from '../dexie'
import axios from 'axios'
import parser from 'fast-xml-parser'
import cheerio from 'cheerio'

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
          const arr = []
          if (json.rss.class) {
            for (const i of json.rss.class.ty) {
              const j = {
                tid: i._id,
                name: i._t
              }
              arr.push(j)
            }
          }
          const doc = {
            class: arr,
            page: json.rss.list._page,
            pagecount: json.rss.list._pagecount,
            pagesize: json.rss.list._pagesize,
            recordcount: json.rss.list._recordcount
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
          const videoList = json.rss.list.video
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
          const pg = {
            page: json.rss.list._page,
            pagecount: json.rss.list._pagecount,
            pagesize: json.rss.list._pagesize,
            recordcount: json.rss.list._recordcount
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
          if (json && json.rss && json.rss.list) {
            const videoList = json.rss.list.video
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
          const videoList = json.rss.list.video
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
        const url = `${site.download}?ac=videolist&ids=${id}&ct=1`
        if (url) {
          axios.post(url).then(res => {
            const data = res.data
            const json = parser.parse(data, this.xmlConfig)
            const videoList = json.rss.list.video
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
   * 获取豆瓣评分
   * @param {*} name 视频名称
   * @returns 豆瓣评分
   */
  doubanRate (name) {
    return new Promise((resolve, reject) => {
      // 豆瓣搜索链接
      var doubanSearchLink = 'https://www.douban.com/search?q=' + name
      axios.get(doubanSearchLink).then(res => {
        const $ = cheerio.load(res.data)
        // 比较第一和第二给豆瓣搜索结果, 看名字是否相符
        var link = ''
        var nameInDouban = $($('div.result')[0]).find('div>div>h3>a').first()
        if (name.replace(/\s/g, '') === nameInDouban.text().replace(/\s/g, '')) {
          link = nameInDouban.attr('href')
        } else {
          nameInDouban = $($('div.result')[1]).find('div>div>h3>a').first()
          if (name.replace(/\s/g, '') === nameInDouban.text().replace(/\s/g, '')) {
            link = nameInDouban.attr('href')
          }
        }
        // 如果找到链接，就打开该链接获取评分
        if (link) {
          axios.get(link).then(response => {
            const parsedHtml = cheerio.load(response.data)
            var rating = parsedHtml('body').find('#interest_sectl').first().find('strong').first()
            if (rating.text()) {
              resolve(rating.text())
            }
          }).catch(err => {
            reject(err)
          })
        } else {
          resolve('暂无评分')
        }
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default zy
