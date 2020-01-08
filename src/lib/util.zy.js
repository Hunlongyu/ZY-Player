import axios from 'axios'
import sites from './sites'
const zy = {
  num: 0,
  page: 1,
  key: '',
  site: {},
  list: [],
  getInfoRequire () {
    return new Promise((resolve, reject) => {
      const key = encodeURI(this.key)
      const params = `${this.site.url}/index.php?m=vod-search-pg-${this.page}-wd-${key}.html`
      axios.get(params).then(res => {
        this.getInfoHtml(res.data).then(res => {
          resolve(res)
        })
      }).catch(err => {
        reject(err)
      })
    })
  },
  getInfoHtml (txt) {
    return new Promise((resolve, reject) => {
      const parser = new DOMParser()
      const html = parser.parseFromString(txt, 'text/html')
      const list = html.querySelectorAll('.xing_vb li')
      let d = {
        list: [],
        num: 0
      }
      for (let i = 1; i < list.length - 1; i++) {
        let info = {
          name: list[i].childNodes[1].innerText,
          detail: this.site.url + list[i].childNodes[1].childNodes[0].getAttribute('href'),
          category: list[i].childNodes[3].innerText,
          time: list[i].childNodes[5].innerText,
          index: 0,
          urls: [],
          check: false
        }
        d.list.push(info)
      }
      let num = html.querySelectorAll('.nvc dd span')[1].innerText
      num = parseInt(num)
      d.num = num
      resolve(d)
    })
  },
  info (n = 0, p = 1, k = null) {
    return new Promise((resolve, reject) => {
      this.page = p
      this.key = k
      this.num = n
      this.site = sites[this.num]
      this.getInfoRequire().then(res => {
        resolve(res)
      })
    })
  },
  detail (url) {
    return new Promise((resolve, reject) => {
      axios.get(url).then(res => {
        resolve(this.getDetailUrls(res.data))
      }).catch(err => {
        reject(err)
      })
    })
  },
  getDetailUrls (txt) {
    return new Promise((resolve, reject) => {
      const parser = new DOMParser()
      let html = parser.parseFromString(txt, 'text/html')
      let data = {
        box: null,
        info: null,
        urls: []
      }
      data.box = html.querySelector('.vodBox').innerHTML
      data.info = html.querySelector('.vodplayinfo').innerHTML
      let urls = html.querySelectorAll('.vodplayinfo li')
      let arr = []
      for (let i in urls) {
        let j = urls[i].innerText
        if (j !== undefined && j.indexOf('.m3u8') !== -1) {
          arr.push(urls[i].innerText)
        }
      }
      data.urls = arr
      resolve(data)
    })
  }
}

export default zy
