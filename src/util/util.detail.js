// import Axios from "axios"
import axios from 'axios'
const detail = {
  getList (url) {
    return new Promise((resolve, reject) => {
      axios({
        url: url,
        method: 'get'
      }).then(res => {
        resolve(this.parser(res.data))
      }).catch(err => {
        reject(err)
      })
    })
  },
  parser (txt) {
    return new Promise((resolve, reject) => {
      const parser = new DOMParser()
      let html = parser.parseFromString(txt, 'text/html')
      let data = {
        box: null,
        info: null,
        m3u8: null
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
      data.m3u8 = arr
      resolve(data)
    })
  }
}

export default detail
