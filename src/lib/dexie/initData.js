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
    name: 'CCTV1-1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cctv1hd/4000000/mnf.m3u8',
    id: 1
  },
  {
    name: 'CCTV-1HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cctv1hd/2300000/mnf.m3u8',
    id: 2
  },
  {
    name: 'CCTV-1',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221225922/1.m3u8',
    id: 3
  },
  {
    name: 'CCTV-2',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226230/1.m3u8',
    id: 4
  },
  {
    name: 'CCTV-2',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221225923/1.m3u8',
    id: 5
  },
  {
    name: 'CCTV-2',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cctv2/1300000/mnf.m3u8',
    id: 6
  },
  {
    name: 'CCTV-3',
    url: 'http://117.169.124.36:6610/ysten-businessmobile/live/cctv-3/1.m3u8',
    id: 7
  },
  {
    name: 'CCTV-3',
    url: 'http://223.110.241.130:6610/gitv/live1/G_CCTV-3-HQ/.m3u8',
    id: 8
  },
  {
    name: 'CCTV-3',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cctv3/1300000/mnf.m3u8',
    id: 9
  },
  {
    name: 'CCTV-4',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cctv4/1300000/mnf.m3u8',
    id: 10
  },
  {
    name: 'CCTV-4',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221225802/1.m3u8',
    id: 11
  },
  {
    name: 'CCTV-4',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226314/1.m3u8',
    id: 12
  },
  {
    name: 'CCTV-5',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cctv5/1300000/mnf.m3u8',
    id: 13
  },
  {
    name: 'CCTV-5',
    url: 'http://112.17.40.145/PLTV/88888888/224/3221226687/index.m3u8',
    id: 14
  },
  {
    name: 'CCTV-5+',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226225/1.m3u8',
    id: 15
  },
  {
    name: 'CCTV-5+',
    url: 'http://117.169.124.46:6410/ysten-businessmobile/live/hdcctv05plus/1.m3u8',
    id: 16
  },
  {
    name: 'CCTV-6',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cctv6/1300000/mnf.m3u8',
    id: 17
  },
  {
    name: 'CCTV-6',
    url: 'http://223.110.243.139/PLTV/3/224/3221225548/index.m3u8',
    id: 18
  },
  {
    name: 'CCTV-6',
    url: 'http://117.169.124.36:6610/ysten-businessmobile/live/cctv-6/1.m3u8',
    id: 19
  },
  {
    name: 'CCTV-7',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226234/1.m3u8',
    id: 20
  },
  {
    name: 'CCTV-7',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221225927/1.m3u8',
    id: 21
  },
  {
    name: 'CCTV-7',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cctv7/1300000/mnf.m3u8',
    id: 22
  },
  {
    name: 'CCTV-8',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cctv8/1300000/mnf.m3u8',
    id: 23
  },
  {
    name: 'CCTV-8',
    url: 'http://117.169.124.36:6610/ysten-businessmobile/live/cctv-8/1.m3u8',
    id: 24
  },
  {
    name: 'CCTV-9',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221225820/1.m3u8',
    id: 25
  },
  {
    name: 'CCTV-9',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226236/1.m3u8',
    id: 26
  },
  {
    name: 'CCTV-10',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cctv10/1300000/mnf.m3u8',
    id: 27
  },
  {
    name: 'CCTV-10',
    url: 'http://ott.fj.chinamobile.com/PLTV/88888888/224/3221225814/1.m3u8',
    id: 28
  },
  {
    name: 'CCTV-10',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226227/1.m3u8',
    id: 29
  },
  {
    name: 'CCTV-11',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cctv11/1300000/mnf.m3u8',
    id: 30
  },
  {
    name: 'CCTV-11',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226315/1.m3u8',
    id: 31
  },
  {
    name: 'CCTV-11',
    url: 'http://ott.fj.chinamobile.com/PLTV/88888888/224/3221225815/1.m3u8',
    id: 32
  },
  {
    name: 'CCTV-12',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221225816/1.m3u8',
    id: 33
  },
  {
    name: 'CCTV-12',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226228/1.m3u8',
    id: 34
  },
  {
    name: 'CCTV-12',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cctv12/1300000/mnf.m3u8',
    id: 35
  },
  {
    name: 'CCTV-13',
    url: 'http://223.110.241.130:6610/gitv/live1/G_CCTV-13-HQ/.m3u8',
    id: 36
  },
  {
    name: 'CCTV-13',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cctvxw/1300000/mnf.m3u8',
    id: 37
  },
  {
    name: 'CCTV-13',
    url: 'http://223.110.247.161:6610/gitv/live1/G_CCTV-13-HQ/1.m3u8',
    id: 38
  },
  {
    name: 'CCTV-14',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cctvse//1300000/mnf.m3u8',
    id: 39
  },
  {
    name: 'CCTV-14',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226229/1.m3u8',
    id: 40
  },
  {
    name: 'CCTV-14',
    url: 'http://117.148.187.37/PLTV/88888888/224/3221226126/index.m3u8',
    id: 41
  },
  {
    name: 'CCTV-15',
    url: 'http://111.13.111.167/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226333/1.m3u8',
    id: 42
  },
  {
    name: 'CCTV-15',
    url: 'http://ott.fj.chinamobile.com/PLTV/88888888/224/3221225818/1.m3u8',
    id: 43
  },
  {
    name: 'CCTV-15',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cctvyy/1300000/mnf.m3u8',
    id: 44
  },
  {
    name: 'CCTV-17',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226318/1.m3u8',
    id: 45
  },
  {
    name: 'CCTV-17',
    url: 'http://ott.fj.chinamobile.com/PLTV/88888888/224/3221226990/1.m3u8',
    id: 46
  },
  {
    name: 'CCTV-4K',
    url: 'http://112.17.40.12/PLTV/88888888/224/3221226758/1.m3u8',
    id: 47
  },
  {
    name: 'CCTV-4K',
    url: 'http://112.17.40.140/PLTV/88888888/224/3221226758/index.m3u8',
    id: 48
  },
  {
    name: 'CCTV-4K',
    url: 'http://39.134.176.148/PLTV/88888888/224/3221226758/index.m3u8',
    id: 49
  },
  {
    name: 'CCTV-4K',
    url: 'http://117.148.187.83/PLTV/88888888/224/3221226758/index.m3u8',
    id: 50
  },
  {
    name: '北京卫视1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/bjwshd/4000000/mnf.m3u8',
    id: 51
  },
  {
    name: '江苏卫视1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/jswshd/4000000/mnf.m3u8',
    id: 52
  },
  {
    name: '浙江卫视1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/zjwshd/4000000/mnf.m3u8',
    id: 53
  },
  {
    name: '深圳卫视1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/szwshd/4000000/mnf.m3u8',
    id: 54
  },
  {
    name: '山东卫视1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/sdwshd/4000000/mnf.m3u8',
    id: 55
  },
  {
    name: '湖北卫视1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hbwshd/4000000/mnf.m3u8',
    id: 56
  },
  {
    name: '广东卫视1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/gdwshd/4000000/mnf.m3u8',
    id: 57
  },
  {
    name: '东方卫视1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hddfws/4000000/mnf.m3u8',
    id: 58
  },
  {
    name: '黑龙江卫视1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hljwshd/4000000/mnf.m3u8',
    id: 59
  },
  {
    name: '五星体育1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/ssty/4000000/mnf.m3u8',
    id: 60
  },
  {
    name: '上海Knews24 1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hdnba8/4000000/mnf.m3u8',
    id: 61
  },
  {
    name: '北京卫视高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/bjwshd/1300000/mnf.m3u8',
    id: 62
  },
  {
    name: '东方卫视高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hddfws/1300000/mnf.m3u8',
    id: 63
  },
  {
    name: '浙江卫视高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/zjwshd/1300000/mnf.m3u8',
    id: 64
  },
  {
    name: '湖北卫视高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hbwshd/1300000/mnf.m3u8',
    id: 65
  },
  {
    name: '湖南卫视高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hnwshd/1300000/mnf.m3u8',
    id: 66
  },
  {
    name: '山东卫视高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/sdwshd/1300000/mnf.m3u8',
    id: 67
  },
  {
    name: '江苏卫视高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/jswshd/1300000/mnf.m3u8',
    id: 68
  },
  {
    name: '深圳卫视高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/szwshd/1300000/mnf.m3u8',
    id: 69
  },
  {
    name: '广东卫视高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/gdwshd/1300000/mnf.m3u8',
    id: 70
  },
  {
    name: '黑龙江卫视高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hljwshd/1300000/mnf.m3u8',
    id: 71
  },
  {
    name: '新闻24高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hdnba8/1300000/mnf.m3u8',
    id: 72
  },
  {
    name: '湖南卫视HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hnwshd/2300000/mnf.m3u8',
    id: 73
  },
  {
    name: '北京卫视HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/bjwshd/2300000/mnf.m3u8',
    id: 74
  },
  {
    name: '江苏卫视HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/jswshd/2300000/mnf.m3u8',
    id: 75
  },
  {
    name: '浙江卫视HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/zjwshd/2300000/mnf.m3u8',
    id: 76
  },
  {
    name: '深圳卫视HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/szwshd/2300000/mnf.m3u8',
    id: 77
  },
  {
    name: '山东卫视HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/sdwshd/2300000/mnf.m3u8',
    id: 78
  },
  {
    name: '湖北卫视HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hbwshd/2300000/mnf.m3u8',
    id: 79
  },
  {
    name: '广东卫视HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/gdwshd/2300000/mnf.m3u8',
    id: 80
  },
  {
    name: '黑龙江卫视HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hljwshd/2300000/mnf.m3u8',
    id: 81
  },
  {
    name: '五星体育HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/ssty/2300000/mnf.m3u8',
    id: 82
  },
  {
    name: '法治天地HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/fztd/1300000/mnf.m3u8',
    id: 83
  },
  {
    name: '欢笑剧场HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hxjc/1300000/mnf.m3u8',
    id: 84
  },
  {
    name: '都市剧场HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/dsjc/1300000/mnf.m3u8',
    id: 85
  },
  {
    name: '七彩戏剧HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/qcxj/1300000/mnf.m3u8',
    id: 86
  },
  {
    name: '动漫秀场HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/dmxc/1300000/mnf.m3u8',
    id: 87
  },
  {
    name: '劲爆体育HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/jbty/1300000/mnf.m3u8',
    id: 88
  },
  {
    name: '极速汽车',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/jsqc/1300000/mnf.m3u8',
    id: 89
  },
  {
    name: '游戏风云',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/yxfy/1300000/mnf.m3u8',
    id: 90
  },
  {
    name: '金鹰卡通',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/jykt/1300000/mnf.m3u8',
    id: 91
  },
  {
    name: '炫动卡通',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/xdkt/1300000/mnf.m3u8',
    id: 92
  },
  {
    name: '嘉佳卡通',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/jjkt/1300000/mnf.m3u8',
    id: 93
  },
  {
    name: '星尚',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/shss/1300000/mnf.m3u8',
    id: 94
  },
  {
    name: '上海纪实',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/jspd/1300000/mnf.m3u8',
    id: 95
  },
  {
    name: '上海新闻',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/xwzh/1300000/mnf.m3u8',
    id: 96
  },
  {
    name: '上海娱乐',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/ylpd/1300000/mnf.m3u8',
    id: 97
  },
  {
    name: '上海电视剧',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/dsjpd/1300000/mnf.m3u8',
    id: 98
  },
  {
    name: '上海ICS外语频道',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/wypd/1300000/mnf.m3u8',
    id: 99
  },
  {
    name: '上海艺术人文',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/ysrw/1300000/mnf.m3u8',
    id: 100
  },
  {
    name: '东方财经浦东',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/dfcj/1300000/mnf.m3u8',
    id: 101
  },
  {
    name: '第一财经',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/dycj/1300000/mnf.m3u8',
    id: 102
  },
  {
    name: '安徽卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/ahws/1300000/mnf.m3u8',
    id: 103
  },
  {
    name: '兵团卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/btws/1300000/mnf.m3u8',
    id: 104
  },
  {
    name: '甘肃卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/gsws/1300000/mnf.m3u8',
    id: 105
  },
  {
    name: '陕西卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/sxws/1300000/mnf.m3u8',
    id: 106
  },
  {
    name: '山西卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/shanxiws/1300000/mnf.m3u8',
    id: 107
  },
  {
    name: '吉林卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/jlws/1300000/mnf.m3u8',
    id: 108
  },
  {
    name: '河北卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hbws/1300000/mnf.m3u8',
    id: 109
  },
  {
    name: '四川卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/scws/1300000/mnf.m3u8',
    id: 110
  },
  {
    name: '贵州卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/gzws/1300000/mnf.m3u8',
    id: 111
  },
  {
    name: '云南卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/ynws/1300000/mnf.m3u8',
    id: 112
  },
  {
    name: '辽宁卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/lnws/1300000/mnf.m3u8',
    id: 113
  },
  {
    name: '旅游卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/lyws/1300000/mnf.m3u8',
    id: 114
  },
  {
    name: '东南卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/dnws/1300000/mnf.m3u8',
    id: 115
  },
  {
    name: '重庆卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cqws/1300000/mnf.m3u8',
    id: 116
  },
  {
    name: '广西卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/gxws/1300000/mnf.m3u8',
    id: 117
  },
  {
    name: '青海卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/qhws/1300000/mnf.m3u8',
    id: 118
  },
  {
    name: '江西卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/jxws/1300000/mnf.m3u8',
    id: 119
  },
  {
    name: '内蒙古卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/nmgws/1300000/mnf.m3u8',
    id: 120
  },
  {
    name: '五星体育HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/ssty/1300000/mnf.m3u8',
    id: 121
  },
  {
    name: '直播1-1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hdnba1/4000000/mnf.m3u8',
    id: 122
  },
  {
    name: '直播2-1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hdnba2/4000000/mnf.m3u8',
    id: 123
  },
  {
    name: '直播3-1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hdnba3/4000000/mnf.m3u8',
    id: 124
  },
  {
    name: '直播4-1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hdnba4/4000000/mnf.m3u8',
    id: 125
  },
  {
    name: '直播5-1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hdnba5/4000000/mnf.m3u8',
    id: 126
  },
  {
    name: '直播6-1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hdnba6/4000000/mnf.m3u8',
    id: 127
  },
  {
    name: '直播7-1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hdnba7/4000000/mnf.m3u8',
    id: 128
  },
  {
    name: 'CCTV-1',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226226/1.m3u8',
    id: 129
  },
  {
    name: '纯享4K源码1',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221226825/1.m3u8',
    id: 130
  },
  {
    name: '百事4K频道',
    url: 'http://112.17.40.145/PLTV/88888888/224/3221226718/index.m3u8',
    id: 131
  },
  {
    name: '凤凰资讯',
    url: 'http://112.17.40.140/PLTV/88888888/224/3221226491/index.m3u8',
    id: 132
  },
  {
    name: '凤凰资讯',
    url: 'http://117.169.124.37:6610/ysten-businessmobile/live/fhzixun/1.m3u8',
    id: 133
  },
  {
    name: '凤凰中文',
    url: 'http://117.169.124.37:6610/ysten-businessmobile/live/fhchinese/1.m3u8',
    id: 134
  },
  {
    name: '凤凰中文',
    url: 'http://117.169.120.138:8080/live/fhchinese/index.m3u8',
    id: 135
  },
  {
    name: '北京卫视',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226224/1.m3u8',
    id: 136
  },
  {
    name: '北京卫视',
    url: 'http://111.40.205.87/PLTV/88888888/224/3221225728/index.m3u8',
    id: 137
  },
  {
    name: '天津卫视',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226246/1.m3u8',
    id: 138
  },
  {
    name: '天津卫视',
    url: 'http://112.17.40.140/PLTV/88888888/224/3221226412/index.m3u8',
    id: 139
  },
  {
    name: '河北卫视超清1',
    url: 'http://223.110.245.149/ott.js.chinamobile.com/PLTV/3/224/3221225840/index.m3u8',
    id: 140
  },
  {
    name: '东方卫视',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226237/1.m3u8',
    id: 141
  },
  {
    name: '湖南卫视',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226241/1.m3u8',
    id: 142
  },
  {
    name: '湖南卫视',
    url: 'http://112.17.40.140/PLTV/88888888/224/3221226553/index.m3u8',
    id: 143
  },
  {
    name: '浙江卫视',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226247/1.m3u8',
    id: 144
  },
  {
    name: '浙江卫视',
    url: 'http://223.110.243.173/PLTV/3/224/3221227215/index.m3u8',
    id: 145
  },
  {
    name: '江苏卫视',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226242/1.m3u8',
    id: 146
  },
  {
    name: '江苏卫视',
    url: 'http://112.17.40.140/PLTV/88888888/224/3221226414/index.m3u8',
    id: 147
  },
  {
    name: '东南卫视',
    url: 'http://117.169.124.37:6610/ysten-businessmobile/live/dongnanstv/yst.m3u8',
    id: 148
  },
  {
    name: '山东卫视',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226308/1.m3u8',
    id: 149
  },
  {
    name: '湖北卫视',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226310/1.m3u8',
    id: 150
  },
  {
    name: '湖北卫视',
    url: 'http://223.110.243.171/PLTV/3/224/3221227211/index.m3u8',
    id: 151
  },
  {
    name: '安徽卫视',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226223/1.m3u8',
    id: 152
  },
  {
    name: '广东卫视',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226238/1.m3u8',
    id: 153
  },
  {
    name: '广东卫视',
    url: 'http://112.17.40.140/PLTV/88888888/224/3221226225/index.m3u8',
    id: 154
  },
  {
    name: '深圳卫视',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226245/1.m3u8',
    id: 155
  },
  {
    name: '深圳卫视',
    url: 'http://223.110.243.171/PLTV/3/224/3221227217/index.m3u8',
    id: 156
  },
  {
    name: '辽宁卫视',
    url: 'http://ott.fj.chinamobile.com/PLTV/88888888/224/3221225947/1.m3u8',
    id: 157
  },
  {
    name: '辽宁卫视',
    url: 'http://223.110.245.145/ott.js.chinamobile.com/PLTV/3/224/3221227410/index.m3u8',
    id: 158
  },
  {
    name: '龙江卫视',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226239/1.m3u8',
    id: 159
  },
  {
    name: '龙江卫视',
    url: 'http://112.17.40.140/PLTV/88888888/224/3221226555/index.m3u8',
    id: 160
  },
  {
    name: '江西卫视',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226243/1.m3u8',
    id: 161
  },
  {
    name: '江西卫视',
    url: 'http://112.17.40.140/PLTV/88888888/224/3221226557/index.m3u8',
    id: 162
  },
  {
    name: '四川卫视',
    url: 'http://ott.fj.chinamobile.com/PLTV/88888888/224/3221227006/1.m3u8',
    id: 163
  },
  {
    name: '重庆卫视',
    url: 'http://ott.fj.chinamobile.com/PLTV/88888888/224/3221225949/1.m3u8',
    id: 164
  },
  {
    name: '重庆卫视',
    url: 'http://ivi.bupt.edu.cn/hls/cqhd.m3u8',
    id: 165
  },
  {
    name: '厦门卫视',
    url: 'http://ott.fj.chinamobile.com/PLTV/88888888/224/3221226781/1.m3u8',
    id: 166
  },
  {
    name: '河南卫视超清2',
    url: 'http://223.110.245.157/ott.js.chinamobile.com/PLTV/3/224/3221225815/index.m3u8',
    id: 167
  },
  {
    name: '贵州卫视超清2',
    url: 'http://223.110.245.149/ott.js.chinamobile.com/PLTV/3/224/3221225787/index.m3u8',
    id: 168
  },
  {
    name: '海南卫视',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221225855/1.m3u8',
    id: 169
  },
  {
    name: '甘肃卫视',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221225877/1.m3u8',
    id: 170
  },
  {
    name: '青海卫视',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221225893/1.m3u8',
    id: 171
  },
  {
    name: '云南卫视超清1',
    url: 'http://223.110.245.159/ott.js.chinamobile.com/PLTV/3/224/3221225838/index.m3u8',
    id: 172
  },
  {
    name: '云南卫视',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221225902/1.m3u8',
    id: 173
  },
  {
    name: '陕西卫视',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221225896/1.m3u8',
    id: 174
  },
  {
    name: '宁夏卫视超清1',
    url: 'http://223.110.245.151/ott.js.chinamobile.com/PLTV/3/224/3221225842/index.m3u8',
    id: 175
  },
  {
    name: '宁夏卫视',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221225892/1.m3u8',
    id: 176
  },
  {
    name: '内蒙卫视超清1',
    url: 'http://223.110.245.161/ott.js.chinamobile.com/PLTV/3/224/3221225836/index.m3u8',
    id: 177
  },
  {
    name: '内蒙卫视',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221225891/1.m3u8',
    id: 178
  },
  {
    name: '西藏卫视',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221225900/1.m3u8',
    id: 179
  },
  {
    name: '山西卫视',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221225895/1.m3u8',
    id: 180
  },
  {
    name: '广西卫视',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221225836/1.m3u8',
    id: 181
  },
  {
    name: '新疆卫视',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221225901/1.m3u8',
    id: 182
  },
  {
    name: '高清影视1台',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221226736/1.m3u8',
    id: 183
  },
  {
    name: '高清影视2台',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221225881/1.m3u8',
    id: 184
  },
  {
    name: '高清影视3台',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221226708/1.m3u8',
    id: 185
  },
  {
    name: '高清影视4台',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221226712/1.m3u8',
    id: 186
  },
  {
    name: '高清影视5台',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221225893/1.m3u8',
    id: 187
  },
  {
    name: '高清影视6台',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221226692/1.m3u8',
    id: 188
  },
  {
    name: '高清影视7台',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221226754/1.m3u8',
    id: 189
  },
  {
    name: '高清影视8台',
    url: 'http://112.17.40.145/PLTV/88888888/224/3221226608/index.m3u8',
    id: 190
  },
  {
    name: '高清影视9台',
    url: 'http://112.17.40.145/PLTV/88888888/224/3221226606/index.m3u8',
    id: 191
  },
  {
    name: '高清影视10台',
    url: 'http://112.17.40.145/PLTV/88888888/224/3221226360/index.m3u8',
    id: 192
  },
  {
    name: '高清动画11台',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221226732/1.m3u8',
    id: 193
  },
  {
    name: '高清动画12台',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221226741/1.m3u8',
    id: 194
  },
  {
    name: '高清动漫13台',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221226743/1.m3u8',
    id: 195
  },
  {
    name: '高清影视14台',
    url: 'http://ivi.bupt.edu.cn/hls/chchd.m3u8',
    id: 196
  },
  {
    name: '北京纪实高清',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221225944/1.m3u8',
    id: 197
  },
  {
    name: '峨眉电影高清',
    url: 'http://scgctvshow.sctv.com/hdlive/emei/1.m3u8',
    id: 198
  },
  {
    name: '欢笑剧场高清',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221226729/1.m3u8',
    id: 199
  },
  {
    name: '纪实频道高清',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221225946/1.m3u8',
    id: 200
  },
  {
    name: '极速汽车高清',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221226140/1.m3u8',
    id: 201
  },
  {
    name: '动漫秀场高清',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221226141/1.m3u8',
    id: 202
  },
  {
    name: '黑莓动画高清',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221225914/1.m3u8',
    id: 203
  },
  {
    name: '黑莓电竞高清',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221225931/1.m3u8',
    id: 204
  },
  {
    name: '黑莓电影高清',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221225927/1.m3u8',
    id: 205
  },
  {
    name: '求索纪录',
    url: 'http://112.17.40.145/PLTV/88888888/224/3221226610/index.m3u8',
    id: 206
  },
  {
    name: '求索科学',
    url: 'http://125.210.152.18:9090/live/QSKX_1200.m3u8',
    id: 207
  },
  {
    name: '求索动物',
    url: 'http://125.210.152.18:9090/live/QSDW_1200.m3u8',
    id: 208
  },
  {
    name: '求索生活',
    url: 'http://125.210.152.18:9090/live/QSSH_1200.m3u8',
    id: 209
  },
  {
    name: '日本天気预报',
    url: 'http://movie.mcas.jp/mcas/wn1_2/master.m3u8',
    id: 210
  },
  {
    name: '中国教育1台',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221225905/1.m3u8',
    id: 211
  },
  {
    name: '中国教育2台',
    url: 'http://cctvalih5ca.v.myalicdn.com/cstv/cetv2_2/index.m3u8',
    id: 212
  },
  {
    name: '中国教育3台',
    url: 'http://cctvalih5ca.v.myalicdn.com/cstv/cetv3_2/index.m3u8',
    id: 213
  },
  {
    name: '中国教育4台',
    url: 'http://cctvalih5ca.v.myalicdn.com/cstv/cetv4_2/index.m3u8',
    id: 214
  },
  {
    name: '山东教育',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221225908/1.m3u8',
    id: 215
  },
  {
    name: '奥林匹克高清',
    url: 'http://ott-live.olympicchannel.com/out/u/OC1_2.m3u8?fluxustv.m3u8',
    id: 216
  },
  {
    name: '奥铃匹克高清',
    url: 'http://ott-live.olympicchannel.com/out/u/OC1_1.m3u8?fluxustv.m3u8',
    id: 217
  },
  {
    name: '超级电影',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226233/1.m3u8',
    id: 218
  },
  {
    name: '超级综艺',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226231/1.m3u8',
    id: 219
  },
  {
    name: '超级体育',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226232/1.m3u8',
    id: 220
  },
  {
    name: '超级剧集',
    url: 'http://111.13.111.167/otttv.bj.chinamobile.com/PLTV/88888888/224/3221225864/1.m3u8',
    id: 221
  },
  {
    name: '中国功夫',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226298/1.m3u8',
    id: 222
  },
  {
    name: '金牌综艺',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226296/1.m3u8',
    id: 223
  },
  {
    name: '农业致富',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226304/1.m3u8',
    id: 224
  },
  {
    name: '潮妈辣婆',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226286/1.m3u8',
    id: 225
  },
  {
    name: '炫舞未来',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226248/1.m3u8',
    id: 226
  },
  {
    name: '明星大片',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226295/1.m3u8',
    id: 227
  },
  {
    name: '自由搏击',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226297/1.m3u8',
    id: 228
  },
  {
    name: '海外综合',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226302/1.m3u8',
    id: 229
  },
  {
    name: '惊梀悬疑',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226294/1.m3u8',
    id: 230
  },
  {
    name: '爱情喜剧',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226299/1.m3u8',
    id: 231
  },
  {
    name: '精品记录',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226293/1.m3u8',
    id: 232
  },
  {
    name: '精品体育',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226328/1.m3u8',
    id: 233
  },
  {
    name: '精品大剧',
    url: 'http://111.13.111.167/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226331/1.m3u8',
    id: 234
  },
  {
    name: '古装剧场',
    url: 'http://111.13.111.167/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226323/1.m3u8',
    id: 235
  },
  {
    name: '军旅剧场',
    url: 'http://111.13.111.167/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226324/1.m3u8',
    id: 236
  },
  {
    name: '军事评论',
    url: 'http://111.13.111.167/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226326/1.m3u8',
    id: 237
  },
  {
    name: '健康有约',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221225919/1.m3u8',
    id: 238
  },
  {
    name: '家庭剧场',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221225918/1.m3u8',
    id: 239
  },
  {
    name: '动作电影',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226288/1.m3u8',
    id: 240
  },
  {
    name: '爱青春',
    url: 'http://112.17.40.140/hwltc.tv.cdn.zj.chinamobile.com/PLTV/88888888/224/3221230130/index.m3u8',
    id: 241
  },
  {
    name: '爱家庭',
    url: 'http://112.17.40.140/hwltc.tv.cdn.zj.chinamobile.com/PLTV/88888888/224/3221230118/index.m3u8',
    id: 242
  },
  {
    name: '爱探索',
    url: 'http://112.17.40.140/hwltc.tv.cdn.zj.chinamobile.com/PLTV/88888888/224/3221230112/index.m3u8',
    id: 243
  },
  {
    name: '爱科学',
    url: 'http://112.17.40.140/hwltc.tv.cdn.zj.chinamobile.com/PLTV/88888888/224/3221230106/index.m3u8',
    id: 244
  },
  {
    name: '爱猎奇',
    url: 'http://112.17.40.140/hwltc.tv.cdn.zj.chinamobile.com/PLTV/88888888/224/3221230097/index.m3u8',
    id: 245
  },
  {
    name: '爱谍战',
    url: 'http://112.17.40.140/hwltc.tv.cdn.zj.chinamobile.com/PLTV/88888888/224/3221230092/index.m3u8',
    id: 246
  },
  {
    name: '爱娱乐',
    url: 'http://112.17.40.140/hwltc.tv.cdn.zj.chinamobile.com/PLTV/88888888/224/3221230077/index.m3u8',
    id: 247
  },
  {
    name: '爱旅行',
    url: 'http://112.17.40.140/hwltc.tv.cdn.zj.chinamobile.com/PLTV/88888888/224/3221230052/index.m3u8',
    id: 248
  },
  {
    name: '爱怀旧',
    url: 'http://112.17.40.140/hwltc.tv.cdn.zj.chinamobile.com/PLTV/88888888/224/3221230049/index.m3u8',
    id: 249
  },
  {
    name: '爱体育',
    url: 'http://112.17.40.140/hwltc.tv.cdn.zj.chinamobile.com/PLTV/88888888/224/3221230034/index.m3u8',
    id: 250
  },
  {
    name: '爱赛车',
    url: 'http://112.17.40.140/hwltc.tv.cdn.zj.chinamobile.com/PLTV/88888888/224/3221230032/index.m3u8',
    id: 251
  },
  {
    name: '票房大片',
    url: 'http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c16_lb_heibangdianying_1080p_t10/c16_lb_heibangdianying_1080p_t10.m3u8',
    id: 252
  },
  {
    name: '惊悚午夜',
    url: 'http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c16_lb_jingnawuyechang_1080p_t10/c16_lb_jingnawuyechang_1080p_t10.m3u8',
    id: 253
  },
  {
    name: '动画电影',
    url: 'http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c16_lb_donghuadianying_1080p_t10/c16_lb_donghuadianying_1080p_t10.m3u8',
    id: 254
  },
  {
    name: '怀旧剧场',
    url: 'http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c16_lb_huaijiujuchang_1080p_t10/c16_lb_huaijiujuchang_1080p_t10.m3u8',
    id: 255
  },
  {
    name: '温情影院',
    url: 'http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c15_lb_chenglong_1080p_t10/c15_lb_chenglong_1080p_t10.m3u8',
    id: 256
  },
  {
    name: '周末影院',
    url: 'http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c16_lb_fengxiaogang_1080p_t10/c16_lb_fengxiaogang_1080p_t10.m3u8',
    id: 257
  },
  {
    name: '经典重温',
    url: 'http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c16_lb_jingdianjuchang_1080p_t10/c16_lb_jingdianjuchang_1080p_t10.m3u8',
    id: 258
  },
  {
    name: '谍战剧场',
    url: 'http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c16_lb_diezhanjuchang_1080p_t10/c16_lb_diezhanjuchang_1080p_t10.m3u8',
    id: 259
  },
  {
    name: '军旅剧场',
    url: 'http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c16_lb_junlvjuchang_1080p_t10/c16_lb_junlvjuchang_1080p_t10.m3u8',
    id: 260
  },
  {
    name: '青春剧场',
    url: 'http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c15_lb_weizhangzhe_1080p_t10/c15_lb_weizhangzhe_1080p_t10.m3u8',
    id: 261
  },
  {
    name: '抗战剧场',
    url: 'http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c15_lb_kangzhanjuchang_1080p_t10/c15_lb_kangzhanjuchang_1080p_t10.m3u8',
    id: 262
  },
  {
    name: '侦探柯南',
    url: 'http://jvc.flashapp.cn/baiducdnct.inter.iqiyi.com/tslive/c20_lb_mingzhentankenan_720p_t10/c20_lb_mingzhentankenan_720p_t10.m3u8',
    id: 263
  },
  {
    name: '喜羊灰狼',
    url: 'http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c15_lb_xiyangyang_1080p_t10/c15_lb_xiyangyang_1080p_t10.m3u8',
    id: 264
  },
  {
    name: '儿子爸爸',
    url: 'http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c16_lb_datouerzi_1080p_t10/c16_lb_datouerzi_1080p_t10.m3u8',
    id: 265
  },
  {
    name: '儿歌大全',
    url: 'http://101.72.196.41/r/baiducdnct.inter.iqiyi.com/tslive/c15_lb_ergedaquan_1080p_t10/c15_lb_ergedaquan_1080p_t10.m3u8',
    id: 266
  },
  {
    name: '北京少儿',
    url: 'http://ivi.bupt.edu.cn/hls/btv10.m3u8',
    id: 267
  },
  {
    name: '动漫电影',
    url: 'http://112.17.40.140/PLTV/88888888/224/3221226178/index.m3u8',
    id: 268
  },
  {
    name: '重庆少儿',
    url: 'http://219.153.252.50/PLTV/88888888/224/3221225646/1.m3u8',
    id: 269
  },
  {
    name: '嘉佳卡通',
    url: 'http://112.17.40.140/PLTV/88888888/224/3221226461/index.m3u8',
    id: 270
  },
  {
    name: '金鹰卡通',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221225906/1.m3u8',
    id: 271
  },
  {
    name: '哈哈卡通',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221225909/1.m3u8',
    id: 272
  },
  {
    name: '优漫卡通',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221225910/1.m3u8',
    id: 273
  },
  {
    name: '卡酷少儿',
    url: 'http://111.13.111.242/otttv.bj.chinamobile.com/PLTV/88888888/224/3221225907/1.m3u8',
    id: 274
  },
  {
    name: '企鹅辅导一年级',
    url: 'http://live-edu.wasu.tv/live/QiEFuDao-lv1.m3u8',
    id: 275
  },
  {
    name: '企鹅辅导二年级',
    url: 'http://live-edu.wasu.tv/live/QiEFuDao-lv2.m3u8',
    id: 276
  },
  {
    name: '企鹅辅导三年级',
    url: 'http://live-edu.wasu.tv/live/QiEFuDao-lv3.m3u8',
    id: 277
  },
  {
    name: '企鹅辅导四年级',
    url: 'http://live-edu.wasu.tv/live/QiEFuDao-lv4.m3u8',
    id: 278
  },
  {
    name: '企鹅辅导五年级',
    url: 'http://live-edu.wasu.tv/live/QiEFuDao-lv5.m3u8',
    id: 279
  },
  {
    name: '企鹅辅导六年级',
    url: 'http://live-edu.wasu.tv/live/QiEFuDao-lv6.m3u8',
    id: 280
  },
  {
    name: '企鹅辅导初一',
    url: 'http://live-edu.wasu.tv/live/QiEFuDao-lv7.m3u8',
    id: 281
  },
  {
    name: '企鹅辅导初二',
    url: 'http://live-edu.wasu.tv/live/QiEFuDao-lv8.m3u8',
    id: 282
  },
  {
    name: '企鹅辅导初三',
    url: 'http://live-edu.wasu.tv/live/QiEFuDao-lv9.m3u8',
    id: 283
  },
  {
    name: '企鹅辅导高一',
    url: 'http://live-edu.wasu.tv/live/QiEFuDao-lv10.m3u8',
    id: 284
  },
  {
    name: '八大精彩台',
    url: 'http://hdtv.ub1818.com/ublive/index_1.m3u8',
    id: 285
  },
  {
    name: '民视第一台',
    url: 'http://hdtv.ub1818.com/ublive/index_2.m3u8',
    id: 286
  },
  {
    name: '民视台湾台',
    url: 'http://hdtv.ub1818.com/ublive/index_3.m3u8',
    id: 287
  },
  {
    name: '民视HD',
    url: 'http://hdtv.ub1818.com/ublive/index_4.m3u8',
    id: 288
  },
  {
    name: 'TvbsHD',
    url: 'http://hdtv.ub1818.com/ublive/index_5.m3u8',
    id: 289
  },
  {
    name: '非凡新闻HD',
    url: 'http://hdtv.ub1818.com/ublive/index_8.m3u8',
    id: 290
  },
  {
    name: '中视新闻HD',
    url: 'http://hdtv.ub1818.com/ublive/index_9.m3u8',
    id: 291
  },
  {
    name: '华视新闻资讯HD',
    url: 'http://hdtv.ub1818.com/ublive/index_10.m3u8',
    id: 292
  },
  {
    name: 'FTV综艺',
    url: 'http://hdtv.ub1818.com/ublive/index_11.m3u8',
    id: 293
  },
  {
    name: '八大综合台',
    url: 'http://hdtv.ub1818.com/ublive/index_12.m3u8',
    id: 294
  },
  {
    name: 'ELTA娱乐',
    url: 'http://hdtv.ub1818.com/ublive/index_13.m3u8',
    id: 295
  },
  {
    name: '亮社',
    url: 'http://hdtv.ub1818.com/ublive/index_14.m3u8',
    id: 296
  },
  {
    name: '华视CTS',
    url: 'http://hdtv.ub1818.com/ublive/index_15.m3u8',
    id: 297
  },
  {
    name: '公视戏剧',
    url: 'http://hdtv.ub1818.com/ublive/index_16.m3u8',
    id: 298
  },
  {
    name: '动漫',
    url: 'http://hdtv.ub1818.com/ublive/index_17.m3u8',
    id: 299
  },
  {
    name: '靖洋卡通台',
    url: 'http://hdtv.ub1818.com/ublive/index_18.m3u8',
    id: 300
  },
  {
    name: '靖天综合台',
    url: 'http://hdtv.ub1818.com/ublive/index_19.m3u8',
    id: 301
  },
  {
    name: '靖天日本台',
    url: 'http://hdtv.ub1818.com/ublive/index_20.m3u8',
    id: 302
  },
  {
    name: '靖天卡通台',
    url: 'http://hdtv.ub1818.com/ublive/index_21.m3u8',
    id: 303
  },
  {
    name: '靖天戏剧台',
    url: 'http://hdtv.ub1818.com/ublive/index_22.m3u8',
    id: 304
  },
  {
    name: '靖天电影台',
    url: 'http://hdtv.ub1818.com/ublive/index_23.m3u8',
    id: 305
  },
  {
    name: '靖天音乐台',
    url: 'http://hdtv.ub1818.com/ublive/index_24.m3u8',
    id: 306
  },
  {
    name: '靖天国际台',
    url: 'http://hdtv.ub1818.com/ublive/index_25.m3u8',
    id: 307
  },
  {
    name: '靖天映画',
    url: 'http://hdtv.ub1818.com/ublive/index_26.m3u8',
    id: 308
  },
  {
    name: '台湾采昌',
    url: 'http://hdtv.ub1818.com/ublive/index_27.m3u8',
    id: 309
  },
  {
    name: '台湾影迷电影',
    url: 'http://hdtv.ub1818.com/ublive/index_28.m3u8',
    id: 310
  },
  {
    name: '台湾CNEX',
    url: 'http://hdtv.ub1818.com/ublive/index_29.m3u8',
    id: 311
  },
  {
    name: '台湾AMC电影',
    url: 'http://hdtv.ub1818.com/ublive/index_30.m3u8',
    id: 312
  },
  {
    name: '靖天资讯台',
    url: 'http://hdtv.ub1818.com/ublive/index_31.m3u8',
    id: 313
  },
  {
    name: '靖天欢乐台',
    url: 'http://hdtv.ub1818.com/ublive/index_32.m3u8',
    id: 314
  },
  {
    name: '靖洋戏剧台',
    url: 'http://hdtv.ub1818.com/ublive/index_33.m3u8',
    id: 315
  },
  {
    name: '台湾音乐',
    url: 'http://hdtv.ub1818.com/ublive/index_34.m3u8',
    id: 316
  },
  {
    name: '韩国娱乐台',
    url: 'http://hdtv.ub1818.com/ublive/index_35.m3u8',
    id: 317
  },
  {
    name: '旅游频道',
    url: 'http://hdtv.ub1818.com/ublive/index_36.m3u8',
    id: 318
  },
  {
    name: '户外频道',
    url: 'http://hdtv.ub1818.com/ublive/index_37.m3u8',
    id: 319
  },
  {
    name: '台视财经HD',
    url: 'http://hdtv.ub1818.com/ublive/index_38.m3u8',
    id: 320
  },
  {
    name: 'TRACE体育',
    url: 'http://hdtv.ub1818.com/ublive/index_39.m3u8',
    id: 321
  },
  {
    name: '耀才财经',
    url: 'http://202.69.67.66:443/webcast/bshdlive-mobile/playlist.m3u8',
    id: 322
  },
  {
    name: '亚旅卫视',
    url: 'http://hls.jingchangkan.tv/jingchangkan/156722438_0HaM/index.m3u8',
    id: 323
  },
  {
    name: '赛马频道',
    url: 'http://tvbilive11-i.akamaihd.net/hls/live/494672/CH88/CH88-01.m3u8',
    id: 324
  },
  {
    name: '東森新聞',
    url: 'http://104.250.154.42:8080/ZZ_dongsenxinwen/ZZ_dongsenxinwen.m3u8',
    id: 325
  },
  {
    name: '東森電影',
    url: 'http://104.250.154.42:8080/ZZ_dongsendianying/ZZ_dongsendianying.m3u8',
    id: 326
  },
  {
    name: '東森洋片',
    url: 'http://192.154.103.75:8080/ZZ_dongsenyangpian/ZZ_dongsenyangpian.m3u8',
    id: 327
  },
  {
    name: '東森洋片',
    url: 'http://104.250.154.42:8080/ZZ_dongsenyangpian/ZZ_dongsenyangpian.m3u8',
    id: 328
  },
  {
    name: '中天新闻',
    url: 'http://104.250.154.42:8080/ZZ_zhongtiannews/ZZ_zhongtiannews.m3u8',
    id: 329
  },
  {
    name: '中天综合',
    url: 'http://104.250.154.42:8080/ZZ_zhongtianzonghe/ZZ_zhongtianzonghe.m3u8',
    id: 330
  },
  {
    name: '中天綜合',
    url: 'http://192.154.103.75:8080//ZZ_zhongtianzonghe/ZZ_zhongtianzonghe.m3u8',
    id: 331
  },
  {
    name: '中天娱乐',
    url: 'http://192.154.103.75:8080//ZZ_zhongtianyule/ZZ_zhongtianyule.m3u8',
    id: 332
  },
  {
    name: '中天娱乐',
    url: 'http://104.250.154.42:8080/ZZ_zhongtianyule/ZZ_zhongtianyule.m3u8',
    id: 333
  },
  {
    name: '中視综合',
    url: 'http://192.154.103.75:8080//ZZ_zhongshi/ZZ_zhongshi.m3u8',
    id: 334
  },
  {
    name: '中视综合',
    url: 'http://104.250.154.42:8080/ZZ_zhongshi/ZZ_zhongshi.m3u8',
    id: 335
  },
  {
    name: '华视综合',
    url: 'http://104.250.154.42:8080/ZZ_huashi/ZZ_huashi.m3u8',
    id: 336
  },
  {
    name: '华视综合',
    url: 'http://192.154.103.75:8080//ZZ_huashi/ZZ_huashi.m3u8',
    id: 337
  },
  {
    name: '年代新聞',
    url: 'http://192.154.103.75:8080/ZZ_niandaixinwen/ZZ_niandianxinwen.m3u8',
    id: 338
  },
  {
    name: '年代新闻',
    url: 'http://104.250.154.42:8080/ZZ_niandaixinwen/ZZ_niandianxinwen.m3u8',
    id: 339
  },
  {
    name: '八大綜合',
    url: 'http://192.154.103.75:8080//ZZ_zhongtianyazhou/ZZ_zhongtianyazhou.m3u8',
    id: 340
  },
  {
    name: '八大综合',
    url: 'http://104.250.154.42:8080/ZZ_zhongtianyazhou/ZZ_zhongtianyazhou.m3u8',
    id: 341
  },
  {
    name: '信吉电视',
    url: 'http://220.130.241.203:1935/sjtv/livestream_360p/playlist.m3u8',
    id: 342
  },
  {
    name: '人間衛視',
    url: 'http://54.64.23.79:1935/live/vod/playlist.m3u8',
    id: 343
  },
  {
    name: '唯心電視',
    url: 'http://mobile.ccdntech.com/transcoder/_definst_/vod164_Live/live/chunklist_w1177047531.m3u8',
    id: 344
  },
  {
    name: '国家地理',
    url: 'http://104.250.154.42:8080/ZZ_hbo/ZZ_hbo.m3u8',
    id: 345
  },
  {
    name: '百事通台',
    url: 'http://112.17.40.145/PLTV/88888888/224/3221226596/index.m3u8',
    id: 346
  },
  {
    name: 'HBO2台',
    url: 'http://161.0.157.5/PLTV/88888888/224/3221227026/03.m3u8？fluxustv.m3u8',
    id: 347
  },
  {
    name: '动物星球',
    url: 'http://104.250.154.42:8080/ZZ_dongwuxingqiu/ZZ_dongwuxingqiu.m3u8',
    id: 348
  },
  {
    name: '华纳电视',
    url: 'http://104.250.154.42:8080/ZZ_huanadianying/ZZ_huanadianying.m3u8',
    id: 349
  },
  {
    name: '福克斯动作',
    url: 'http://104.250.154.42:8080/ZZ_foxaction/ZZ_foxaction.m3u8',
    id: 350
  },
  {
    name: '福克斯动作',
    url: 'http://192.154.103.75:8080/ZZ_foxaction/ZZ_foxaction.m3u8',
    id: 351
  },
  {
    name: '点掌财经',
    url: 'http://cclive2.aniu.tv/live/anzb.m3u8',
    id: 352
  },
  {
    name: '澳门卫视',
    url: 'http://stream.mastvnet.com/MSTV/SD/live.m3u8',
    id: 353
  },
  {
    name: '澳亚卫视',
    url: 'http://stream.mastvnet.com/MSTV/playlist.m3u8',
    id: 354
  },
  {
    name: '日本NHK华语',
    url: 'https://nhkw-zh-hlscomp.akamaized.net/ixxemlzk1vqvy44o/playlist.m3u8',
    id: 355
  },
  {
    name: '日本NHK英语',
    url: 'https://nhkwlive-ojp.akamaized.net/hls/live/2003459/nhkwlive-ojp/index_1M.m3u8',
    id: 356
  },
  {
    name: '日本Japan News 24',
    url: 'http://www.news24.jp/livestream/index.m3u8',
    id: 357
  },
  {
    name: '日本JapanetChannelDX',
    url: 'http://bcsecurelivehls-i.akamaihd.net/hls/live/265320/5043843989001/140130JTDX/index_1200.m3u8',
    id: 358
  },
  {
    name: '日本QVC',
    url: 'http://cdn-live1.qvc.jp/iPhone/800/800.m3u8',
    id: 359
  },
  {
    name: '韩国EBS 第一频道',
    url: 'http://ebsonairios.ebs.co.kr/groundwavetablet500k/tablet500k/playlist.m3u8',
    id: 360
  },
  {
    name: '韩国EBS 少儿频道',
    url: 'http://ebsonairios.ebs.co.kr/ebsutablet500k/tablet500k/playlist.m3u8',
    id: 361
  },
  {
    name: '韩国KCTV',
    url: 'http://119.77.96.184:1935/chn21/chn21/chunklist_w252131137.m3u8',
    id: 362
  },
  {
    name: '韩国UBC SBS',
    url: 'http://59.25.202.81:1935/live/UBCstream/chunklist_w1495115977.m3u8',
    id: 363
  },
  {
    name: '朝鲜中央台',
    url: 'http://119.77.96.184:1935/chn05/chn05/chunklist_w644291506.m3u8',
    id: 364
  },
  {
    name: '韩国KTV 韩国电视',
    url: 'http://218.38.152.31:1935/klive/klive.stream/playlist.m3u8',
    id: 365
  },
  {
    name: '韩国EBS 儿童频道',
    url: 'http://ebsonairios.ebs.co.kr/ebsutablet500k/_definst_/tablet500k/chunklist_w1965791004.m3u8',
    id: 366
  },
  {
    name: '韩国YTN 联合新闻',
    url: 'http://ytnmmd.mmdlive.lldns.net/ytnmmd/9484b70302db4786886ae40308bf45a1/chunklist_b2592000.m3u8',
    id: 367
  },
  {
    name: '韩国阿里郎WORLDworld',
    url: 'http://amdlive.ctnd.com.edgesuite.net/arirang_1ch/smil:arirang_1ch.smil/playlist.m3u8',
    id: 368
  },
  {
    name: '韩国阿里郎WORLD',
    url: 'http://amdlive.ctnd.com.edgesuite.net/arirang_1ch/smil:arirang_1ch/master.m3u8',
    id: 369
  },
  {
    name: '韩国MBC MAX',
    url: 'http://63.237.48.3/ios/MBC_MAX/MBC_MAX.m3u8',
    id: 370
  },
  {
    name: 'KOREA YTN Science',
    url: 'http://slive.sciencetv.kr:1935/science/yslive_20140419_1/playlist.m3u8',
    id: 371
  },
  {
    name: 'Luxury World',
    url: 'http://nano.teleservice.su:8080/hls/luxury.m3u8',
    id: 372
  },
  {
    name: '韩国BBS佛教广播',
    url: 'http://bbstv.clouducs.com:1935/bbstv-live/livestream/chunklist_w1403706733.m3u8',
    id: 373
  },
  {
    name: 'CPAC',
    url: 'http://bcoveliveios-i.akamaihd.net/hls/live/248519/1242843915001_1/master.m3u8',
    id: 374
  },
  {
    name: 'CGTN 记录频道',
    url: 'http://live.cgtn.com/1000d/prog_index.m3u8',
    id: 375
  },
  {
    name: '中国环球',
    url: 'http://live.cgtn.com/1000/prog_index.m3u8',
    id: 376
  },
  {
    name: '狗狗宠物',
    url: 'http://video.blivenyc.com/broadcast/prod/2061/22/file-3192k.m3u8',
    id: 377
  },
  {
    name: '法国时尚',
    url: 'http://lb.streaming.sk/fashiontv/stream/chunklist_w1702070444.m3u8',
    id: 378
  },
  {
    name: '亚洲新闻',
    url: 'http://d2e1asnsl7br7b.cloudfront.net/7782e205e72f43aeb4a48ec97f66ebbe/index_4.m3u8',
    id: 379
  },
  {
    name: '朝阳频道',
    url: 'http://d11h6a6nhl9kj9.cloudfront.net/hls/suriactv/master02.m3u8',
    id: 380
  },
  {
    name: '越南人民报',
    url: 'http://27.118.16.98:1935/live/truyenhinhnhandan720/chunklist_w2006762604.m3u8',
    id: 381
  },
  {
    name: '越南人民报',
    url: 'http://vietcago.net/vstv/thnd.m3u8',
    id: 382
  },
  {
    name: '印度音乐电视',
    url: 'http://104.237.60.234/live/gabruutv.m3u8?dsjtv.m3u8',
    id: 383
  },
  {
    name: '法国中国环球',
    url: 'http://live.cgtn.com/1000f/prog_index.m3u8',
    id: 384
  },
  {
    name: '法国第五世界台',
    url: 'http://v3plusinfo247hls-i.akamaihd.net/hls/live/218877-b/v3plusinfo247hls/v3plusinfo247hls_1_1.m3u8',
    id: 385
  },
  {
    name: '阿拉伯中国环球',
    url: 'http://live.cgtn.com/1000a/prog_index.m3u8',
    id: 386
  },
  {
    name: '俄罗斯中国环球',
    url: 'http://live.cgtn.com/1000r/prog_index.m3u8',
    id: 387
  },
  {
    name: '俄罗斯HD时尚频道',
    url: 'http://95.67.47.115/hls/hdfashion_ua_hi/index.m3u8',
    id: 388
  },
  {
    name: '乌克兰M2 音乐频道',
    url: 'http://live.m2.tv/hls3/stream.m3u8',
    id: 389
  },
  {
    name: '西班牙中国环球',
    url: 'http://livees.cgtn.com/1000e/prog_index.m3u8',
    id: 390
  },
  {
    name: '意大利Rai高清',
    url: 'http://b2everyrai-lh.akamaihd.net/i/raigulp_1@66350/master.m3u8',
    id: 391
  },
  {
    name: '意大利Rai 少儿',
    url: 'http://b2everyrai-lh.akamaihd.net/i/raiyoyo_1@191405/master.m3u8',
    id: 392
  },
  {
    name: '意大利Rai 电影',
    url: 'http://b2everyrai-lh.akamaihd.net/i/raimovie_1@67348/master.m3u8',
    id: 393
  },
  {
    name: '意大利意大利电台',
    url: 'http://radioitaliatv-lh.akamaihd.net/i/radioitaliatv_1@329645/index_720x480_av-p.m3u8',
    id: 394
  },
  {
    name: '意大利V2 音乐频道',
    url: 'http://de1se01.v2beat.live/playlist.m3u8',
    id: 395
  },
  {
    name: '墨西哥墨西哥电视',
    url: 'http://bcoveliveios-i.akamaihd.net/hls/live/201661/57828478001/milenio_center_512k@51752.m3u8',
    id: 396
  },
  {
    name: '音乐20TV',
    url: 'http://m2otv-lh.akamaihd.net/i/m2oTv_1@186074/index_600_av-p.m3u8',
    id: 397
  },
  {
    name: '当红MTV',
    url: 'http://unilivemtveu-lh.akamaihd.net/i/mtvno_1@346424/index_3500_av-b.m3u8',
    id: 398
  },
  {
    name: 'WSVI-TV',
    url: 'http://dcunilive30-lh.akamaihd.net/i/dclive_1@534251/master.m3u8?fluxustv.m3u8',
    id: 399
  },
  {
    name: '酷酷频道',
    url: 'http://edge1.tikilive.com:1935/unrestricted_tikilive/25947/amlst:NWKlw6jwyXpz/chunklist_w981409619_b1105254.m3u8?fluxustv.m3u8',
    id: 400
  },
  {
    name: '红牛电视',
    url: 'http://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master_1660.m3u8',
    id: 401
  },
  {
    name: 'NBC电视',
    url: 'http://161.0.157.51/PLTV/88888888/224/3221227040/index.m3u8?fluxustv.m3u8',
    id: 402
  },
  {
    name: 'Jewelry电视',
    url: 'http://wowzaprod134-i.akamaihd.net/hls/live/577814/ccddaf02/playlist.m3u8',
    id: 403
  },
  {
    name: 'Darcizzle电视',
    url: 'http://30a-tv.com/darcizzle.m3u8',
    id: 404
  },
  {
    name: 'CBS新闻',
    url: 'http://cbsnewshd-lh.akamaihd.net/i/CBSNHD_7@199302/master.m3u8',
    id: 405
  },
  {
    name: '美国Deutsche Welle',
    url: 'http://dwstream4-lh.akamaihd.net/i/dwstream4_live@131329/master.m3u8',
    id: 406
  },
  {
    name: '美国360 North',
    url: 'http://wowzaprod3-i.akamaihd.net/hls/live/252236/2147483647_360north_247/playlist.m3u8',
    id: 407
  },
  {
    name: '美国Fox News Talk Radio',
    url: 'http://fnurtmp-f.akamaihd.net/i/FNRADIO_1@92141/master.m3u8',
    id: 408
  },
  {
    name: '日本NHK台',
    url: 'http://nhkwtvglobal-i.akamaihd.net/hls/live/263941/nhkwtvglobal/index_600.m3u8',
    id: 409
  },
  {
    name: '日本cgntv',
    url: 'http://cgntv-glive.ofsdelivery.net/live/_definst_/cgntv_jp/playlist.m3u8',
    id: 410
  },
  {
    name: '日本映画',
    url: 'http://192.240.127.34:1935/live/cs19.stream/playlist.m3u8',
    id: 411
  },
  {
    name: '日本Japanet Channel DX',
    url: 'http://bcsecurelivehls-i.akamaihd.net/hls/live/265320/5043843989001/140130JTDX/index_600.m3u8',
    id: 412
  }
]

export {
  setting,
  sites,
  iptv,
  localKey,
  getSite
}
