import fly from 'flyio'
import sites from './sites'
import { TimeSelect } from 'element-ui'

interface ZY {
  num: number
  page: number
  key: string
  site: any
  list: Array<string>
  getInfoRequire: any
  getInfoHtml: any
  info: any
  detail: any
  films: any
}

interface info {
  name?: string
  type?: string
  time?: string
  detail?: string
  urls?: Array<string>
  index?: number
}

interface detail {
  box?: any
  info?: any
  urls?: Array<string>
}

const zy: ZY = {
  num: 0,
  page: 1,
  key: '',
  site: {},
  list: [],
  getInfoRequire () {
    return new Promise((resolve, reject) => {
      let key = encodeURI(this.key)
      const params = `${this.site.url}/index.php?m=vod-search-pg-${this.page}-wd-${key}.html`
      fly.get(params).then(res => {
        this.getInfoHtml(res.data).then((data: any) => {
          resolve(data)
        })
      }).catch(err => {
        reject(err)
      })
    })
  },
  getInfoHtml (txt: string): any {
    return new Promise((resolve, reject) => {
      try {
        const parser = new DOMParser()
        const html = parser.parseFromString(txt, 'text/html')
        const list: any = html.querySelectorAll('.xing_vb li')
        let d: any = { list: [], total: 0 }
        for (let i = 1; i < list.length - 1; i++) {
          let info: info = {
            name: list[i].childNodes[1].innerText,
            type: list[i].childNodes[3].innerText,
            time: list[i].childNodes[5].innerText,
            detail: this.site.url + list[i].childNodes[1].childNodes[0].getAttribute('href'),
            index: 0,
            urls: []
          }
          d.list.push(info)
        }
        let num: any = (<HTMLImageElement>html.querySelectorAll('.nvc dd span')[1]).innerText
        num = parseInt(num)
        d.total = num
        resolve(d)
      } catch (err) {
        reject(err)
      }
    })
  },
  info (n: number = 0, p: number = 1, k: string = '') {
    return new Promise((resolve, reject) => {
      this.num = n
      this.page = p
      this.key = k
      this.site = sites[n]
      this.getInfoRequire().then((res: any) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    })
  },
  detail (url: string) {
    return new Promise((resolve, reject) => {
      if (!url) return
      fly.get(url).then(res => {
        const parser = new DOMParser()
        let html = parser.parseFromString(res.data, 'text/html')
        let data: detail = {
          box: '',
          info: '',
          urls: []
        }
        let vodBox = html.querySelector('.vodBox')
        if (vodBox) {
          data.box = vodBox.innerHTML
        }
        let vodInfo = {}
        if (url.indexOf('123ku') !== -1 || url.indexOf('subo988') !== -1) {
          vodInfo = html.querySelectorAll('.vodplayinfo')[1]
        } else {
          vodInfo = <HTMLImageElement>html.querySelector('.vodplayinfo')
        }
        data.info = (<HTMLImageElement>vodInfo).innerText
        let urls = html.querySelectorAll('.vodplayinfo li')
        let arr = []
        for (let i in urls) {
          let j = (<HTMLImageElement>urls[i]).innerText
          if (j !== undefined && j.indexOf('.m3u8') !== -1) {
            arr.push((<HTMLImageElement>urls[i]).innerText)
          }
        }
        data.urls = arr
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  films (n: number = 0, p: number = 1, type: string = '0') {
    return new Promise((resolve, reject) => {
      this.site = sites[n]
      let url: string = sites[n].url
      let params: string = ''
      if (type === '0') {
        params = `${url}/?m=vod-index-pg-${p}.html`
      } else {
        params = `${url}/?m=vod-type-id-${type}-pg-${p}.html`
      }
      fly.get(params).then(res => {
        const parser = new DOMParser()
        const html = parser.parseFromString(res.data, 'text/html')
        const list: any = html.querySelectorAll('.xing_vb li')
        let d: any = { list: [], total: 0 }
        for (let i = 1; i < list.length - 1; i++) {
          let info: info = {
            name: list[i].childNodes[1].innerText,
            type: list[i].childNodes[3].innerText,
            time: list[i].childNodes[5].innerText,
            detail: this.site.url + list[i].querySelector('a').getAttribute('href'),
            index: 0,
            urls: []
          }
          d.list.push(info)
        }
        let num: any = html.querySelectorAll('.pages')
        if (num) {
          let n = num[0].innerText
          n = n.split('条')[0]
          n = n.split('共')[1]
          n = parseInt(n)
          d.total = n
        }
        resolve(d)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default zy
