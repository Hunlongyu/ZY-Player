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
  detail () {}
}

export default zy
