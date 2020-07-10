import { sites } from '../dexie'
import axios from 'axios'
import parser from 'fast-xml-parser'
const zy = {
  ports: 4848, // 端口号
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
        const site = res
        axios.post(`http://localhost:${this.ports}/api`, { url: site.api }).then(res => {
          const data = res.data.info
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
        axios.post(`http://localhost:${this.ports}/api`, { url: url }).then(async res => {
          const data = res.data.info
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
        axios.post(`http://localhost:${this.ports}/api`, { url: url }).then(async res => {
          const data = res.data.info
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
        axios.post(`http://localhost:${this.ports}/api`, { url: site.api + '?wd=' + wd }).then(res => {
          const data = res.data.info
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
   * 获取资源详情
   * @param {*} key 资源网 key
   * @param {*} id 资源唯一标识符 id
   * @returns
   */
  detail (key, id) {
    return new Promise((resolve, reject) => {
      this.getSite(key).then(res => {
        axios.post(`http://localhost:${this.ports}/api`, { url: res.api + '?ac=videolist&ids=' + id }).then(res => {
          const data = res.data.info
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
        const url = site.download
        if (url) {
          axios.post(`http://localhost:${this.ports}/api`, { url: url + '?ac=videolist&ids=' + id + '&ct=1' }).then(res => {
            const data = res.data.info
            const json = parser.parse(data, this.xmlConfig)
            const videoList = json.rss.list.video
            resolve(videoList)
          }).catch(err => {
            reject(err)
          })
        } else {
          resolve(null)
        }
      })
    })
  }
}

export default zy
