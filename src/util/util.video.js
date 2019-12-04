// import Axios from "axios"
import axios from 'axios'
const video = {
  url: 'http://www.666zy.com/',
  getList (url, txt) {
    const t = encodeURI(txt)
    const d = `wd=${t}&submit=search`
    axios({
      url: url,
      method: 'post',
      params: { m: 'vod-search' },
      data: d
    }).then(res => {
      this.parser(res.data)
    })
  },
  parser (txt) {
    const parser = new DOMParser()
    let html = parser.parseFromString(txt, 'text/html')
    let data = []
    let name = []
    let detail = []
    let type = []
    let time = []
    let nameList = html.querySelectorAll('.xing_vb4 a')
    for (let i = 0; i < nameList.length; i++) {
      name.push(nameList[i].innerText)
      detail.push('http://www.666zy.com' + nameList[i].getAttribute('href'))
    }
    let typeList = html.querySelectorAll('.xing_vb5 a')
    for (let i = 0; i < typeList.length; i++) {
      type.push(typeList[i].innerText)
    }
    let timeList = html.querySelectorAll('.xing_vb6')
    for (let i = 0; i < timeList.length; i++) {
      time.push(timeList[i].innerText)
    }
    for (let i = 0; i < name.length; i++) {
      let d = {}
      d.name = name[i]
      d.detail = detail[i]
      d.type = type[i]
      d.time = time[i]
      data.push(d)
    }
    return data
  }
}

export default video
