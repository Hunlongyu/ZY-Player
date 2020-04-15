import axios from 'axios'
import { getSite } from './sites'
const zy = {
  key: 'zuidazy', // sites[n] 视频源
  id: 0, // 视频类型
  page: 1, // 第几页
  keywords: '', // 搜索关键字
  // 获取浏览列表
  film_get (key, id = 1, page = 1) {
    return new Promise((resolve, reject) => {
      const site = getSite(key)
      let url = ''
      if (id === 0) {
        url = site.new.replace(/{page}/, page)
      } else {
        url = site.view.replace(/{id}/, id).replace(/{page}/, page)
      }
      const type = site.type
      axios.get(url).then(async res => {
        const data = res.data
        if (type === 0) {
          const zeroData = await this.film_get_type_zero(data, key)
          resolve(zeroData)
        }
        if (type === 1) {
          const oneData = await this.film_get_type_one(data, key)
          resolve(oneData)
        }
        if (type === 2) {
          const twoData = await this.film_get_type_two(data, key)
          resolve(twoData)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  film_get_type_zero (txt, key) {
    return new Promise((resolve, reject) => {
      try {
        const parser = new DOMParser()
        const html = parser.parseFromString(txt, 'text/html')
        const list = html.querySelectorAll('.xing_vb li')
        const d = { list: [], total: 0, update: 0 }
        const url = getSite(key).url
        for (let i = 1; i < list.length - 1; i++) {
          const info = {
            site: key,
            name: list[i].childNodes[1].innerText,
            type: list[i].childNodes[3].innerText,
            time: list[i].childNodes[5].innerText,
            detail: url + list[i].childNodes[1].querySelector('a').getAttribute('href'),
            index: 0
          }
          d.list.push(info)
        }
        d.update = parseInt(html.querySelectorAll('.xing_top_right li strong')[0].innerText)
        let t = html.querySelector('.pages').innerText
        t = t.split('条')[0]
        t = t.split('共')[1]
        d.total = parseInt(t)
        resolve(d)
      } catch (err) {
        reject(err)
      }
    })
  },
  film_get_type_one (txt, key) {
    return new Promise((resolve, reject) => {
      try {
        const parser = new DOMParser()
        const html = parser.parseFromString(txt, 'text/html')
        const list = html.querySelectorAll('.videoContent li')
        const d = { list: [], total: 0, update: 0 }
        const url = getSite(key).url
        for (let i = 0; i < list.length; i++) {
          const info = {
            site: key,
            name: list[i].querySelector('.videoName').innerText,
            type: list[i].querySelector('.category').innerText,
            time: list[i].querySelector('.time').innerText,
            detail: url + list[i].querySelector('.address').getAttribute('href'),
            index: 0
          }
          d.list.push(info)
        }
        d.update = parseInt(html.querySelectorAll('.header_list li span')[0].innerText)
        let t = html.querySelectorAll('.pagination li')
        t = t[t.length - 2].innerText
        d.total = parseInt(t) * 50
        resolve(d)
      } catch (err) {
        reject(err)
      }
    })
  },
  film_get_type_two (txt, key) {
    return new Promise((resolve, reject) => {
      try {
        const parser = new DOMParser()
        const html = parser.parseFromString(txt, 'text/html')
        const list = html.querySelectorAll('.nr')
        const d = { list: [], total: 0, update: 0 }
        const url = getSite(key).url
        for (let i = 0; i < list.length; i++) {
          const info = {
            site: key,
            name: '',
            type: list[i].querySelector('.btn_span').innerText,
            time: list[i].querySelector('.hours').innerText,
            detail: url + list[i].querySelector('.name').getAttribute('href'),
            index: 0
          }
          let name = list[i].querySelector('.name').innerText
          name = name.replace(/^\s*|\s*$/g, '')
          info.name = name
          d.list.push(info)
        }
        d.update = parseInt(html.querySelector('.kfs em').innerText)
        d.total = parseInt(html.querySelector('.date span').innerText)
        let t = html.querySelector('.pag2').innerText
        t = t.split('条')[0]
        t = t.split('共')[1]
        d.total = parseInt(t)
        resolve(d)
      } catch (err) {
        reject(err)
      }
    })
  },
  // 获取详情
  detail_get (key, url) {
    return new Promise((resolve, reject) => {
      const type = getSite(key).type
      axios.get(url).then(async res => {
        if (type === 0) {
          const zeroData = await this.detail_get_type_zero(res.data, key)
          resolve(zeroData)
        }
        if (type === 1) {
          const oneData = await this.detail_get_type_one(res.data, key)
          resolve(oneData)
        }
        if (type === 2) {
          const twoData = await this.detail_get_type_two(res.data, key)
          resolve(twoData)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  detail_get_type_zero (txt, key) {
    return new Promise((resolve, reject) => {
      try {
        const parser = new DOMParser()
        const html = parser.parseFromString(txt, 'text/html')
        const data = {
          site: key,
          name: '',
          info: '',
          desc: '',
          m3u8_urls: [],
          mp4_urls: []
        }
        const vodBox = html.querySelector('.vodBox')
        data.info = vodBox.innerHTML
        const title = html.querySelector('.vodh h2').innerText
        const index = html.querySelector('.vodh span').innerText
        data.name = title + index
        const vodInfo = html.querySelectorAll('.playBox')
        for (let i = 0; i < vodInfo.length; i++) {
          const k = vodInfo[i].innerText
          if (k.indexOf('剧情介绍') >= 0) {
            data.desc = vodInfo[i].querySelector('.vodplayinfo').innerHTML
          }
        }
        const vodLi = html.querySelectorAll('.ibox .vodplayinfo li')
        const m3u8UrlArr = []
        const mp4UrlArr = []
        for (let i = 0; i < vodLi.length; i++) {
          const j = vodLi[i].innerText
          if (j.indexOf('.m3u8') >= 0) {
            m3u8UrlArr.push(j)
          }
          if (j.indexOf('.mp4') >= 0) {
            mp4UrlArr.push(j)
          }
        }
        data.m3u8_urls = m3u8UrlArr
        data.mp4_urls = mp4UrlArr
        resolve(data)
      } catch (err) {
        reject(err)
      }
    })
  },
  detail_get_type_one (txt, key) {
    return new Promise((resolve, reject) => {
      try {
        const parser = new DOMParser()
        const html = parser.parseFromString(txt, 'text/html')
        const data = {
          site: key,
          name: '',
          info: '',
          desc: '',
          m3u8_urls: [],
          mp4_urls: []
        }
        let name = html.querySelector('.whitetitle').innerText
        name = name.split('：')[1].replace(/^\s*|\s*$/g, '')
        data.name = name
        const vodBox = html.querySelector('.white').innerHTML
        data.info = vodBox
        const vodInfo = html.querySelectorAll('.white')
        for (let i = 0; i < vodInfo.length; i++) {
          const k = vodInfo[i].innerText
          if (k.indexOf('剧情介绍') >= 0) {
            data.desc = vodInfo[i].querySelector('div').innerText
          }
        }
        const vodLi = html.querySelectorAll('.playlist li #m3u8')
        const m3u8UrlArr = []
        const mp4UrlArr = []
        for (let i = 0; i < vodLi.length; i++) {
          const j = vodLi[i].value
          if (j.indexOf('.m3u8') >= 0) {
            m3u8UrlArr.push(j)
          }
          if (j.indexOf('.mp4') >= 0) {
            mp4UrlArr.push(j)
          }
        }
        data.m3u8_urls = m3u8UrlArr
        data.mp4_urls = mp4UrlArr
        resolve(data)
      } catch (err) {
        reject(err)
      }
    })
  },
  detail_get_type_two (txt, key) {
    return new Promise((resolve, reject) => {
      try {
        const parser = new DOMParser()
        const html = parser.parseFromString(txt, 'text/html')
        const data = {
          site: key,
          name: '',
          info: '',
          desc: '',
          m3u8_urls: [],
          mp4_urls: []
        }
        const title = html.querySelector('.vodh h2').innerText
        const index = html.querySelector('.vodh span').innerText
        data.name = title + index
        const vodBox = html.querySelector('.vodBox').innerHTML
        data.info = vodBox
        data.desc = html.querySelector('.vodplayinfo').innerText
        const vodLi = html.querySelectorAll('.vodplayinfo li')
        const m3u8UrlArr = []
        const mp4UrlArr = []
        for (let i = 0; i < vodLi.length; i++) {
          const j = vodLi[i].innerText
          if (j.indexOf('.m3u8') >= 0) {
            m3u8UrlArr.push(j)
          }
          if (j.indexOf('.mp4') >= 0) {
            mp4UrlArr.push(j)
          }
        }
        data.m3u8_urls = m3u8UrlArr
        data.mp4_urls = mp4UrlArr
        resolve(data)
      } catch (err) {
        reject(err)
      }
    })
  },
  // 搜索列表
  search_get (key, keywords = '', page = 1) {
    return new Promise((resolve, reject) => {
      const site = getSite(key)
      const type = site.type
      let url = null
      if (type === 0) {
        url = site.search.replace(/{page}/, page).replace(/{keywords}/, keywords)
      }
      if (type === 1) {
        url = site.search.replace(/{keywords}/, keywords)
      }
      axios.get(url).then(async res => {
        const data = res.data
        if (type === 0) {
          const zeroData = await this.search_get_type_zero(data, key)
          resolve(zeroData)
        }
        if (type === 1) {
          const oneData = await this.search_get_type_one(data, key)
          resolve(oneData)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  search_get_type_zero (txt, key) {
    return new Promise((resolve, reject) => {
      try {
        const parser = new DOMParser()
        const html = parser.parseFromString(txt, 'text/html')
        const list = html.querySelectorAll('.xing_vb li')
        const d = { list: [], total: 0 }
        const url = getSite(key).url
        for (let i = 1; i < list.length - 1; i++) {
          const info = {
            site: key,
            name: list[i].childNodes[1].innerText,
            type: list[i].childNodes[3].innerText,
            time: list[i].childNodes[5].innerText,
            detail: url + list[i].childNodes[1].querySelector('a').getAttribute('href'),
            index: 0
          }
          d.list.push(info)
        }
        const t = html.querySelector('.nvc dd').innerText.replace(/[^\d]/g, '')
        d.total = parseInt(t)
        resolve(d)
      } catch (err) {
        reject(err)
      }
    })
  },
  search_get_type_one (txt, key) {
    return new Promise((resolve, reject) => {
      try {
        const parser = new DOMParser()
        const html = parser.parseFromString(txt, 'text/html')
        const list = html.querySelectorAll('.videoContent li')
        const d = { list: [], total: 0 }
        const url = getSite(key).url
        for (let i = 0; i < list.length; i++) {
          const info = {
            site: key,
            name: list[i].querySelector('.videoName').innerText,
            type: list[i].querySelector('.category').innerText,
            time: list[i].querySelector('.time').innerText,
            detail: url + list[i].querySelector('.address').getAttribute('href'),
            index: 0
          }
          d.list.push(info)
        }
        d.total = list.length
        resolve(d)
      } catch (err) {
        reject(err)
      }
    })
  }
}

export default zy
