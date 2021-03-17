import open from 'open'
import axios from 'axios'
import cheerio from 'cheerio'

const onlineVideo = {
  playVideoOnline (selectedOnlineSite, videoName, videoIndex) {
    switch (selectedOnlineSite) {
      case '哔嘀':
        onlineVideo.playVideoOnBde4(videoName, videoIndex)
        break
      case '1080影视':
        onlineVideo.playVideoOnK1080(videoName, videoIndex)
        break
      case '素白白':
        onlineVideo.playVideoOnSubaibai(videoName, videoIndex)
        break
      case '哆咪动漫':
        onlineVideo.playVideoOndmdm2020(videoName, videoIndex)
        break
      case '樱花动漫':
        onlineVideo.playVideoOnYhdm(videoName, videoIndex)
        break
      case '简影':
        onlineVideo.playVideoOnSyrme(videoName, videoIndex)
        break
      case '极品':
        onlineVideo.playVideoOnJpysvip(videoName, videoIndex)
        break
      case '喜欢看':
        onlineVideo.playVideoOnXhkan(videoName, videoIndex)
        break
      default:
        this.$message.console.error(`不支持该网站：${this.selectedOnlineSite}`)
    }
  },
  playVideoOnBde4 (videoName, videoIndex) {
    videoName = videoName.replace(/\s/g, '')
    const url = `https://bde4.com/search/${videoName}`
    axios.get(url).then(res => {
      const $ = cheerio.load(res.data)
      const e = $('div.search-list')
      const searchResult = $(e).find('div>div>div>div>a').toArray()
      // 获取第一个搜索结果的视频链接
      const detailPageLink = $(searchResult[0]).attr('href')
      // 获取第一个搜索结果的title
      const title = $(searchResult[0]).attr('title')
      if (title === null || title === undefined || !title.replace(/\s/g, '').includes(videoName)) {
        // 如果第一个搜索结果不符合，打开搜索页面
        open(url)
      } else {
        const detailPageFullLink = 'https://bde4.com/' + detailPageLink
        // 解析详情页面
        axios.get(detailPageFullLink).then(res => {
          const $ = cheerio.load(res.data)
          const d = $('div.info1')
          const videoList = $(d).find('a').toArray()
          let videoFullLink = detailPageFullLink
          // 获取index视频链接
          if (videoIndex < videoList.length) {
            const indexVideoLink = $(videoList[videoIndex]).attr('href')
            if (indexVideoLink.includes('.htm')) {
              videoFullLink = 'https://bde4.com' + indexVideoLink
            }
          }
          open(videoFullLink)
        })
      }
    })
  },
  playVideoOnK1080 (videoName, videoIndex) {
    videoName = videoName.replace(/\s/g, '')
    const url = `https://k1080.net/vodsearch123/-------------.html?wd=${videoName}&submit=`
    axios.get(url).then(res => {
      const $ = cheerio.load(res.data)
      const e = $('#searchList')
      const searchResult = $(e).find('li>div>a').toArray()
      // 获取第一个搜索结果的视频链接
      const detailPageLink = $(searchResult[0]).attr('href')
      // 获取第一个搜索结果的title
      const title = $(searchResult[0]).attr('title')
      if (title === null || title === undefined || !title.replace(/\s/g, '').includes(videoName)) {
        // 如果第一个搜索结果不符合，打开搜索页面
        open(url)
      } else {
        // 解析详情页面
        const detailPageFullLink = 'https://k1080.net' + detailPageLink
        axios.get(detailPageFullLink).then(res2 => {
          const $ = cheerio.load(res2.data)
          // 获取playlist1
          const d = $('#playlist1')
          // 获取所有视频链接
          const videoList = $(d).find('div>ul>li>a').toArray()
          let videoFullLink = detailPageFullLink
          // 获取index视频链接
          if (videoIndex < videoList.length) {
            const indexVideoLink = $(videoList[videoIndex]).attr('href')
            if (indexVideoLink.includes('.htm')) {
              videoFullLink = 'https://k1080.net' + indexVideoLink
            }
          }
          open(videoFullLink)
        })
      }
    })
  },
  playVideoOnSubaibai (videoName, videoIndex) {
    videoName = videoName.replace(/\s/g, '')
    const url = `https://www.subaibai.com/xssearch?q=${videoName}`
    axios.get(url).then(res => {
      const $ = cheerio.load(res.data)
      const e = $('div.search_list')
      const searchResult = $(e).find('div>ul>li>h3>a').toArray()
      // 获取第一个搜索结果的视频链接
      const detailPageLink = $(searchResult[0]).attr('href')
      // 获取第一个搜索结果的title
      const title = $(searchResult[0]).text()
      if (title === null || title === undefined || !title.replace(/\s/g, '').includes(videoName)) {
        // 如果第一个搜索结果不符合，打开搜索页面
        open(url)
      } else {
        // 解析详情页面
        const detailPageFullLink = detailPageLink
        axios.get(detailPageFullLink).then(res2 => {
          const $ = cheerio.load(res2.data)
          // 获取playlist1
          const d = $('div.paly_list_btn')
          // 获取所有视频链接
          const videoList = $(d).find('a').toArray()
          // 获取index视频链接
          let videoFullLink = detailPageFullLink
          if (videoIndex < videoList.length) {
            const indexVideoLink = $(videoList[videoIndex]).attr('href')
            if (indexVideoLink.includes('.htm')) {
              videoFullLink = indexVideoLink
            }
          }
          open(videoFullLink)
        })
      }
    })
  },
  playVideoOnYhdm (videoName, videoIndex) {
    videoName = videoName.replace(/\s/g, '')
    const url = `http://www.yhdm.tv/search/${videoName}`
    axios.get(url).then(res => {
      const $ = cheerio.load(res.data)
      const e = $('div.lpic')
      const searchResult = $(e).find('div>ul>li>h2>a').toArray()
      // 获取第一个搜索结果的视频链接
      const detailPageLink = $(searchResult[0]).attr('href')
      // 获取第一个搜索结果的title
      const title = $(searchResult[0]).attr('title')
      if (title === null || title === undefined || !title.replace(/\s/g, '').includes(videoName)) {
        // 如果第一个搜索结果不符合，打开搜索页面
        open(url)
      } else {
        // 解析详情页面
        const detailPageFullLink = 'http://www.yhdm.tv/' + detailPageLink
        axios.get(detailPageFullLink).then(res2 => {
          const $ = cheerio.load(res2.data)
          // 获取playlist1
          const d = $('div.movurl')
          // 获取所有视频链接
          const videoList = $(d).find('div>ul>li>a').toArray()
          // 获取index视频链接
          let videoFullLink = detailPageFullLink
          if (videoIndex < videoList.length) {
            const indexVideoLink = $(videoList[videoIndex]).attr('href')
            if (indexVideoLink.includes('.htm')) {
              videoFullLink = 'http://www.yhdm.tv/' + indexVideoLink
            }
          }
          open(videoFullLink)
        })
      }
    })
  },
  playVideoOndmdm2020 (videoName, videoIndex) {
    videoName = videoName.replace(/\s/g, '')
    const url = `http://www.dmdm2020.com/dongmansearch.html?wd=${videoName}&submit=`
    axios.get(url).then(res => {
      const $ = cheerio.load(res.data)
      const e = $('#searchList')
      const searchResult = $(e).find('ul>li>div>h4>a').toArray()
      // 获取第一个搜索结果的视频链接
      const detailPageLink = $(searchResult[0]).attr('href')
      // 获取第一个搜索结果的title
      const title = $(searchResult[0]).text()
      if (title === null || title === undefined || !title.replace(/\s/g, '').includes(videoName)) {
        // 如果第一个搜索结果不符合，打开搜索页面
        open(url)
      } else {
        // 解析详情页面
        const detailPageFullLink = 'http://www.dmdm2020.com' + detailPageLink
        axios.get(detailPageFullLink).then(res2 => {
          const $ = cheerio.load(res2.data)
          // 获取playlist1
          const d = $('#playlist1')
          // 获取所有视频链接
          const videoList = $(d).find('div>ul>li>a').toArray()
          // 获取index视频链接
          let videoFullLink = detailPageFullLink
          if (videoIndex < videoList.length) {
            const indexVideoLink = $(videoList[videoIndex]).attr('href')
            if (indexVideoLink.includes('.htm')) {
              videoFullLink = 'http://www.dmdm2020.com' + indexVideoLink
            }
          }
          open(videoFullLink)
        })
      }
    })
  },
  playVideoOnSyrme (videoName, videoIndex) {
    videoName = videoName.replace(/\s/g, '')
    const url = `https://syrme.top/searchs?q=${videoName}`
    axios.get(url).then(res => {
      const $ = cheerio.load(res.data)
      const e = $('ul.MovieList')
      const searchResult = $(e).find('ul>li>article>a').toArray()
      // 获取第一个搜索结果的视频链接
      const detailPageLink = $(searchResult[0]).attr('href')
      // 获取第一个搜索结果的title
      const title = $(searchResult[0]).find('a>h2').text()
      if (title === null || title === undefined || !title.replace(/\s/g, '').includes(videoName)) {
        // 如果第一个搜索结果不符合，打开搜索页面
        open(url)
      } else {
        // 解析详情页面
        const detailPageFullLink = 'https://syrme.top' + detailPageLink
        axios.get(detailPageFullLink).then(res2 => {
          const $ = cheerio.load(res2.data)
          // 获取playlist1
          const d = $('#categories-2')
          // 获取所有视频链接
          const videoList = $(d).find('div>ul>li>a').toArray()
          // 获取index视频链接
          let videoFullLink = detailPageFullLink
          if (videoIndex < videoList.length) {
            const indexVideoLink = $(videoList[videoIndex]).attr('href')
            videoFullLink = 'https://syrme.top' + indexVideoLink
          }
          open(videoFullLink)
        })
      }
    })
  },
  playVideoOnJpysvip (videoName, videoIndex) {
    videoName = videoName.replace(/\s/g, '')
    const url = `https://www.jpysvip.net/vodsearch/-------------.html?wd=${videoName}&submit=`
    axios.get(url).then(res => {
      const $ = cheerio.load(res.data)
      const e = $('#searchList')
      const searchResult = $(e).find('ul>li>div>a').toArray()
      // 获取第一个搜索结果的视频链接
      const detailPageLink = $(searchResult[0]).attr('href')
      // 获取第一个搜索结果的title
      const title = $(searchResult[0]).attr('title')
      if (title === null || title === undefined || !title.replace(/\s/g, '').includes(videoName)) {
        // 如果第一个搜索结果不符合，打开搜索页面
        open(url)
      } else {
        // 解析详情页面
        const detailPageFullLink = 'https://www.jpysvip.net' + detailPageLink
        axios.get(detailPageFullLink).then(res2 => {
          const $ = cheerio.load(res2.data)
          // 获取playlist1
          const d = $('#playlist1')
          // 获取所有视频链接
          const videoList = $(d).find('div>ul>li>a').toArray()
          // 获取index视频链接
          let videoFullLink = detailPageFullLink
          if (videoIndex < videoList.length) {
            const indexVideoLink = $(videoList[videoIndex]).attr('href')
            videoFullLink = 'https://www.jpysvip.net/' + indexVideoLink
          }
          open(videoFullLink)
        })
      }
    })
  },
  playVideoOnXhkan (videoName, videoIndex) {
    videoName = videoName.replace(/\s/g, '')
    const url = `https://www.xhkan.com/vodsearch.html?wd=${videoName}&submit=`
    axios.get(url).then(res => {
      const $ = cheerio.load(res.data)
      const e = $('#searchList')
      const searchResult = $(e).find('ul>li>div>a').toArray()
      // 获取第一个搜索结果的视频链接
      const detailPageLink = $(searchResult[0]).attr('href')
      // 获取第一个搜索结果的title
      const title = $(searchResult[0]).attr('title')
      if (title === null || title === undefined || !title.replace(/\s/g, '').includes(videoName)) {
        // 如果第一个搜索结果不符合，打开搜索页面
        open(url)
      } else {
        // 解析详情页面
        const detailPageFullLink = detailPageLink
        axios.get(detailPageFullLink).then(res2 => {
          const $ = cheerio.load(res2.data)
          // 获取playlist1
          const d = $('#playlist1')
          // 获取所有视频链接
          const videoList = $(d).find('div>ul>li>a').toArray()
          // 获取index视频链接
          let videoFullLink = detailPageFullLink
          if (videoIndex < videoList.length) {
            const indexVideoLink = $(videoList[videoIndex]).attr('href')
            videoFullLink = indexVideoLink
          }
          open(videoFullLink)
        })
      }
    })
  }
}
export default onlineVideo
