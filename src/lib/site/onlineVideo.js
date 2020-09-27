import open from 'open'
import axios from 'axios'
import cheerio from 'cheerio'

const onlineVideo = {
  playVideoOnBde4 (videoName, videoIndex) {
    videoName = videoName.replace(/\s/g, '')
    var url = `https://bde4.com/search/${videoName}`
    axios.get(url).then(res => {
      const $ = cheerio.load(res.data)
      var e = $('div.search-list')
      var searchResult = $(e).find('div>div>div>div>a').toArray()
      // 获取第一个搜索结果的视频链接
      var detailPageLink = $(searchResult[0]).attr('href')
      // 获取第一个搜索结果的title
      var title = $(searchResult[0]).attr('title')
      if (title === null || title === undefined || !title.replace(/\s/g, '').includes(videoName)) {
        // 如果第一个搜索结果不符合，打开搜索页面
        open(url)
      } else {
        var detailPageFullLink = 'https://bde4.com/' + detailPageLink
        // 解析详情页面
        axios.get(detailPageFullLink).then(res => {
          const $ = cheerio.load(res.data)
          var e = $('div.info1')
          var videoList = $(e).find('a').toArray()
          var videoFullLink = detailPageFullLink
          // 获取index视频链接
          if (videoIndex < videoList.length) {
            var indexVideoLink = $(videoList[videoIndex]).attr('href')
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
    var url = `https://k1080.net/vodsearch123/-------------.html?wd=${videoName}&submit=`
    axios.get(url).then(res => {
      const $ = cheerio.load(res.data)
      var e = $('#searchList')
      var searchResult = $(e).find('li>div>a').toArray()
      // 获取第一个搜索结果的视频链接
      var detailPageLink = $(searchResult[0]).attr('href')
      // 获取第一个搜索结果的title
      var title = $(searchResult[0]).attr('title')
      if (title === null || title === undefined || !title.replace(/\s/g, '').includes(videoName)) {
        // 如果第一个搜索结果不符合，打开搜索页面
        open(url)
      } else {
        // 解析详情页面
        var detailPageFullLink = 'https://k1080.net' + detailPageLink
        axios.get(detailPageFullLink).then(res2 => {
          const $ = cheerio.load(res2.data)
          // 获取playlist1
          var e = $('#playlist1')
          // 获取所有视频链接
          var videoList = $(e).find('div>ul>li>a').toArray()
          var videoFullLink = detailPageFullLink
          // 获取index视频链接
          if (videoIndex < videoList.length) {
            var indexVideoLink = $(videoList[videoIndex]).attr('href')
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
    var url = `https://www.subaibai.com/xssearch?q=${videoName}`
    axios.get(url).then(res => {
      const $ = cheerio.load(res.data)
      var e = $('div.search_list')
      var searchResult = $(e).find('div>ul>li>h3>a').toArray()
      // 获取第一个搜索结果的视频链接
      var detailPageLink = $(searchResult[0]).attr('href')
      // 获取第一个搜索结果的title
      var title = $(searchResult[0]).text()
      if (title === null || title === undefined || !title.replace(/\s/g, '').includes(videoName)) {
        // 如果第一个搜索结果不符合，打开搜索页面
        open(url)
      } else {
        // 解析详情页面
        var detailPageFullLink = detailPageLink
        axios.get(detailPageFullLink).then(res2 => {
          const $ = cheerio.load(res2.data)
          // 获取playlist1
          var e = $('div.paly_list_btn')
          // 获取所有视频链接
          var videoList = $(e).find('a').toArray()
          // 获取index视频链接
          var videoFullLink = detailPageFullLink
          if (videoIndex < videoList.length) {
            var indexVideoLink = $(videoList[videoIndex]).attr('href')
            if (indexVideoLink.includes('.htm')) {
              videoFullLink = indexVideoLink
            }
          }
          open(videoFullLink)
        })
      }
    })
  }
}
export default onlineVideo
