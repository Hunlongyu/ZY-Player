const setting = [
  {
    id: 0,
    theme: 'light',
    site: 'zuidazy',
    shortcut: true,
    view: 'picture'
  }
]

const sites = [
  {
    id: 1,
    key: 'okzy',
    name: 'OK 资源网',
    api: 'http://cj.okzy.tv/inc/api.php',
    download: 'http://cj.okzy.tv/inc/apidown.php'
  },
  {
    id: 2,
    key: 'zuidazy',
    name: '最大资源网',
    api: 'http://www.zdziyuan.com/inc/api.php',
    download: 'http://www.zdziyuan.com/inc/apidown.php'
  },
  {
    id: 3,
    key: 'doubanzy',
    name: '豆瓣电影资源',
    api: 'http://v.1988cj.com/inc/api.php',
    download: 'http://v.1988cj.com/inc/apidown.php'
  },
  {
    id: 4,
    key: '135zy',
    name: '135 资源网',
    api: 'http://cj.zycjw1.com/inc/api.php',
    download: 'http://cj.zycjw1.com/inc/apidown.php'
  },
  {
    id: 5,
    key: 'kuyunzy',
    name: '酷云资源',
    api: 'http://caiji.kuyun98.com/inc/ldg_api.php',
    download: 'http://caiji.kuyun98.com/inc/apidown.php'
  },
  {
    id: 6,
    key: 'mgtvzy',
    name: '芒果 TV 资源网',
    api: 'https://api.shijiapi.com/api.php/provide/vod/at/xml/',
    download: ''
  },
  {
    id: 7,
    key: 'subo988',
    name: '速播资源站',
    api: 'https://www.subo988.com/inc/api.php',
    download: ''
  },
  {
    id: 8,
    key: '209zy',
    name: '209 资源',
    api: 'http://cj.1156zy.com/inc/api.php',
    download: ''
  },
  {
    id: 9,
    key: 'zuixinzy',
    name: '最新资源',
    api: 'http://api.zuixinapi.com/inc/api.php',
    download: ''
  },
  {
    id: 10,
    key: 'kubozy',
    name: '酷播资源',
    api: 'http://api.kbzyapi.com/inc/api.php',
    download: ''
  },
  {
    id: 11,
    key: 'yongjiuzy',
    name: '永久资源',
    api: 'http://cj.yongjiuzyw.com/inc/api.php',
    download: ''
  },
  {
    id: 12,
    key: '123ku',
    name: '123 资源',
    api: 'http://cj.123ku2.com:12315/inc/api.php',
    download: ''
  },
  {
    id: 13,
    key: '88zyw',
    name: '88 影视资源站',
    api: 'http://www.88zyw.net/inc/api.php',
    download: ''
  },
  {
    id: 14,
    key: 'wolongzy',
    name: '卧龙资源',
    api: 'http://cj.wlzy.tv/inc/api_mac.php',
    download: ''
  },
  {
    id: 15,
    key: 'mahuazy',
    name: '麻花资源',
    api: 'https://www.mhapi123.com/inc/api.php',
    download: ''
  },
  {
    id: 16,
    key: 'kkzy',
    name: '快快资源',
    api: 'https://api.kkzy.tv/inc/api.php',
    download: ''
  },
  {
    id: 17,
    key: '158zy',
    name: '壹伍捌资源网',
    api: 'http://cj.158zyz.net:158/inc/api.php',
    download: ''
  },
  {
    id: 18,
    key: 'rrzy',
    name: '人人资源',
    api: 'https://www.rrzyw.cc/api.php/provide/vod/from/rrm3u8/at/xml/',
    download: ''
  },
  {
    id: 19,
    key: 'mokazy',
    name: '魔卡资源网',
    api: 'https://cj.heiyap.com/api.php/provide/vod/at/xml/',
    download: ''
  },
  {
    id: 20,
    key: 'kyzy',
    name: '快影资源站',
    api: 'https://www.kyzy.tv/api.php/kyyun/vod/at/xml/',
    download: ''
  },
  {
    id: 21,
    key: 'solezy',
    name: '搜乐资源网',
    api: 'https://www.caijizy.vip/api.php/provide/vod/at/xml/',
    download: ''
  },
  {
    id: 22,
    key: 'bbkdj',
    name: '步步高顶尖资源网',
    api: 'http://api.bbkdj.com/api',
    download: ''
  },
  {
    id: 23,
    key: '1886zy',
    name: '1886 资源',
    api: 'http://cj.1886zy.co/inc/api.php',
    download: ''
  },
  {
    id: 24,
    key: 'mbo',
    name: '秒播资源',
    api: 'http://caiji.mb77.vip/inc/api.php',
    download: ''
  }
]

const localKey = [
  {
    name: 'playAndPause',
    desc: '播放或暂停',
    key: 'space'
  },
  {
    name: 'forward',
    desc: '快进',
    key: 'right'
  },
  {
    name: 'back',
    desc: '快退',
    key: 'left'
  },
  {
    name: 'volumeUp',
    desc: '音量调高',
    key: 'up'
  },
  {
    name: 'volumeDown',
    desc: '音量调低',
    key: 'down'
  },
  {
    name: 'mute',
    desc: '静音',
    key: 'm'
  },
  {
    name: 'top',
    desc: '置顶或退出置顶',
    key: 't'
  },
  {
    name: 'fullscreen',
    desc: '进入或退出全屏',
    key: 'f'
  },
  {
    name: 'escape',
    desc: '退出全屏',
    key: 'esc'
  },
  {
    name: 'next',
    desc: '下一集',
    key: 'alt+right'
  },
  {
    name: 'prev',
    desc: '上一集',
    key: 'alt+left'
  },
  {
    name: 'home',
    desc: '跳到视频开始位置',
    key: 'home'
  },
  {
    name: 'end',
    desc: '跳到视频结束位置',
    key: 'end'
  },
  {
    name: 'opacityUp',
    desc: '透明度调高',
    key: 'alt+up'
  },
  {
    name: 'opacityDown',
    desc: '透明度调低',
    key: 'alt+down'
  },
  {
    name: 'playbackRateUp',
    desc: '播放倍速加快',
    key: 'pageup'
  },
  {
    name: 'playbackRateDown',
    desc: '播放倍速减慢',
    key: 'pagedown'
  },
  {
    name: 'mini',
    desc: '进入或退出mini模式',
    key: 'alt+m'
  }
]

const getSite = (key) => {
  for (const i of sites) {
    if (key === i.key) {
      return i
    }
  }
}

const iptv = [
  {
    name: '東森新聞',
    url: 'http://lss.line-scdn.net/cc_tw/p/live/hPFcU2yqYDmgJQRB4NlQTX2UtVl4kHRpsax1DCy8sUQ0jTx07Zh9CB38rVlgmGU05YEpIWnosVF82HRo3Z0JBDH0yUVhsH0o9fU5GEHIuWllyHUE-/720/chunklist.m3u8'
  },
  {
    name: '民視新闻',
    url: 'http://lss.line-scdn.net/cc_tw/p/live/hrw-UR8uCLFlBQTJJeFQxbit8IG1tGG0JeB1hOmcsczxtTGkMeBlkOjMoIW9qT2kGKkpqazUkcGk8WWtcJE9ra2EsbWg8A2kMLlVkOCoscW82HGsPJUs/720/chunklist.m3u8'
  },
  {
    name: 'TVBS新闻',
    url: 'http://lss.line-scdn.net/cc_tw/p/live/hN97FnM2yEBdaUg4HYkcNIDFvHyJyXwQTZQ5ddH0_T3J3BlcQPwtWdX06HydyB1ASMFlWJS83TyIuSlcSPlxXJXpoUSYmEFVCNEZadjA2TS0nDldJNw/720/chunklist.m3u8'
  },
  {
    name: 'BBC News UK',
    url: 'http://51.52.156.22:8888/http/004'
  },
  {
    name: 'Music Channel',
    url: 'https://edge126.rcs-rds.ro/utvedge/musicchannelhq.stream/playlist.m3u8'
  },
  {
    name: 'FOX Sport HD 1',
    url: 'https://austchannel-live.akamaized.net/hls/live/2002736/austchannel-sport/master.m3u8'
  }
]

export {
  setting,
  sites,
  iptv,
  localKey,
  getSite
}
