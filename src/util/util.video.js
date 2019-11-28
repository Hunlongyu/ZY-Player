// import Axios from "axios"
import axios from 'axios'
const video = {
  url: 'http://www.666zy.com/',
  init () {
    console.log('init')
    this.post(this.url, '冰雪奇缘')
  },
  getList () {},
  post (url, txt) {
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
    const html = parser.parseFromString(txt, 'text/html')
    console.log(html)
    const list = html.querySelectorAll('.xing_vb4 a')
    console.log(list)
    for (let i = 0; i < list.length; i++) {
      console.log(i, list[i].innerHTML, 'innerHTML')
      console.log(i, list[i].getAttribute('href'), 'href')
    }
  }
}

export default video
