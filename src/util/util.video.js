// import Axios from "axios"
import axios from 'axios'
const video = {
  getList (url, txt) {
    return new Promise((resolve, reject) => {
      const t = encodeURI(txt)
      const d = `wd=${t}&submit=search`
      axios({
        url: url,
        method: 'post',
        params: { m: 'vod-search' },
        data: d
      }).then(res => {
        resolve(this.parser(url, res.data))
      })
    })
  },
  parser (url, txt) {
    return new Promise((resolve, reject) => {
      const parser = new DOMParser()
      let html = parser.parseFromString(txt, 'text/html')
      let data = []
      let name = []
      let detail = []
      let category = []
      let time = []
      let nameList = html.querySelectorAll('.xing_vb4 a')
      for (let i = 0; i < nameList.length; i++) {
        name.push(nameList[i].innerText)
        detail.push(url + nameList[i].getAttribute('href'))
      }
      let typeList = html.querySelectorAll('.xing_vb5 a')
      for (let i = 0; i < typeList.length; i++) {
        category.push(typeList[i].innerText)
      }
      let timeList = html.querySelectorAll('.xing_vb6')
      for (let i = 0; i < timeList.length; i++) {
        time.push(timeList[i].innerText)
      }
      for (let i = 0; i < name.length; i++) {
        let d = {}
        d.name = name[i]
        d.detail = detail[i]
        d.category = category[i]
        d.time = time[i]
        data.push(d)
      }
      console.log(data)
      resolve(data)
    })
  }
}

export default video
