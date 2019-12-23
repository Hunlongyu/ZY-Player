import axios from 'axios'

const haku = {
  url: 'https://www.666zy.com',
  getHtml (txt) {
    return new Promise((resolve, reject) => {
      const t = encodeURI(txt)
      const d = `wd=${t}&submit=search`
      axios({
        url: this.url + '/index.php',
        method: 'post',
        params: { m: 'vod-search' },
        data: d
      }).then(res => {
        resolve(this.getVideoInfo(res.data))
      }).catch(err => {
        reject(err)
      })
    })
  },
  getVideoInfo (txt) {
    return new Promise((resolve, reject) => {
      const parser = new DOMParser()
      let html = parser.parseFromString(txt, 'text/html')
      let nameList = html.querySelectorAll('.xing_vb4 a')
      let name = []
      let detail = []
      for (let i = 0; i < nameList.length; i++) {
        name.push(nameList[i].innerText)
        detail.push(this.url + nameList[i].getAttribute('href'))
      }
      let categoryList = html.querySelectorAll('.xing_vb5 a')
      let category = []
      for (let i = 0; i < categoryList.length; i++) {
        category.push(categoryList[i].innerText)
      }
      let timeList = html.querySelectorAll('.xing_vb6')
      let time = []
      for (let i = 0; i < timeList.length; i++) {
        time.push(timeList[i].innerText)
      }
      let data = []
      for (let i = 0; i < name.length; i++) {
        let d = {}
        d.name = name[i]
        d.detail = detail[i]
        d.category = category[i]
        d.time = time[i]
        d.index = 0
        d.urls = []
        d.check = false
        data.push(d)
      }
      resolve(data)
    })
  },
  getDetail (url) {
    return new Promise((resolve, reject) => {
      axios({
        url: url,
        method: 'get'
      }).then(res => {
        resolve(this.getUrls(res.data))
      }).catch(err => {
        reject(err)
      })
    })
  },
  getUrls (txt) {
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
      let url = html.querySelectorAll('.vodplayinfo a')
      let arr = []
      for (let i in url) {
        let j = url[i].innerHTML
        if (j !== undefined && j.indexOf('.m3u8') !== -1) {
          arr.push(url[i].innerHTML)
        }
      }
      data.urls = arr
      resolve(data)
    })
  }
}

export default haku
