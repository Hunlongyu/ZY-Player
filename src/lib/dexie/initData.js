const setting = [
  {
    id: 0,
    theme: 'light',
    shortcut: true,
    view: 'picture',
    externalPlayer: '',
    searchAllSites: true,
    excludeRootClasses: true,
    excludeR18Films: true,
    forwardTimeInSec: 5
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
  },
  {
    id: 25,
    key: '605zy',
    name: '605资源',
    api: 'http://www.605zy.net/inc/seacmsapi.php',
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
    id: 16912
  },
  {
    name: 'CCTV-1HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cctv1hd/2300000/mnf.m3u8',
    id: 16913
  },
  {
    name: 'CCTV1 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221225924/1.m3u8',
    id: 16914
  },
  {
    name: 'CCTV1 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226154/1.m3u8',
    id: 16915
  },
  {
    name: 'CCTV1 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226155/1.m3u8',
    id: 16916
  },
  {
    name: 'CCTV1 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226226/1.m3u8',
    id: 16917
  },
  {
    name: 'CCTV1 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226346/1.m3u8',
    id: 16918
  },
  {
    name: 'CCTV1 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226431/1.m3u8',
    id: 16919
  },
  {
    name: 'CCTV2 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226230/1.m3u8',
    id: 16920
  },
  {
    name: 'CCTV2 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226371/1.m3u8',
    id: 16921
  },
  {
    name: 'CCTV2 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226472/1.m3u8',
    id: 16922
  },
  {
    name: 'CCTV3 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226471/1.m3u8',
    id: 16923
  },
  {
    name: 'CCTV4 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226314/1.m3u8',
    id: 16924
  },
  {
    name: 'CCTV4 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226335/1.m3u8',
    id: 16925
  },
  {
    name: 'CCTV4 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226470/1.m3u8',
    id: 16926
  },
  {
    name: 'CCTV5 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226469/1.m3u8',
    id: 16927
  },
  {
    name: 'CCTV5+ HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226225/1.m3u8',
    id: 16928
  },
  {
    name: 'CCTV5+ CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226349/1.m3u8',
    id: 16929
  },
  {
    name: 'CCTV5+ CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226458/1.m3u8',
    id: 16930
  },
  {
    name: 'CCTV6 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226468/1.m3u8',
    id: 16931
  },
  {
    name: 'CCTV7 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226234/1.m3u8',
    id: 16932
  },
  {
    name: 'CCTV7 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226467/1.m3u8',
    id: 16933
  },
  {
    name: 'CCTV8 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226485/1.m3u8',
    id: 16934
  },
  {
    name: 'CCTV9 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226236/1.m3u8',
    id: 16935
  },
  {
    name: 'CCTV9 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226465/1.m3u8',
    id: 16936
  },
  {
    name: 'CCTV10 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226227/1.m3u8',
    id: 16937
  },
  {
    name: 'CCTV10 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226464/1.m3u8',
    id: 16938
  },
  {
    name: 'CCTV11 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226334/1.m3u8',
    id: 16939
  },
  {
    name: 'CCTV11 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226315/1.m3u8',
    id: 16940
  },
  {
    name: 'CCTV11 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226463/1.m3u8',
    id: 16941
  },
  {
    name: 'CCTV12 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226228/1.m3u8',
    id: 16942
  },
  {
    name: 'CCTV12 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226462/1.m3u8',
    id: 16943
  },
  {
    name: 'CCTV13 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226316/1.m3u8',
    id: 16944
  },
  {
    name: 'CCTV14 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226229/1.m3u8',
    id: 16945
  },
  {
    name: 'CCTV14 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226461/1.m3u8',
    id: 16946
  },
  {
    name: 'CCTV15 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226460/1.m3u8',
    id: 16947
  },
  {
    name: 'CCTV15 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226317/1.m3u8',
    id: 16948
  },
  {
    name: 'CCTV15 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226333/1.m3u8',
    id: 16949
  },
  {
    name: 'CCTV17 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226318/1.m3u8',
    id: 16950
  },
  {
    name: 'CCTV17 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226459/1.m3u8',
    id: 16951
  },
  {
    name: 'CCTV-4K',
    url: 'http://112.17.40.12/PLTV/88888888/224/3221226758/1.m3u8',
    id: 16952
  },
  {
    name: 'CCTV-4K',
    url: 'http://112.17.40.140/PLTV/88888888/224/3221226758/index.m3u8',
    id: 16953
  },
  {
    name: 'CCTV-4K',
    url: 'http://39.134.176.148/PLTV/88888888/224/3221226758/index.m3u8',
    id: 16954
  },
  {
    name: 'CCTV-4K',
    url: 'http://117.148.187.83/PLTV/88888888/224/3221226758/index.m3u8',
    id: 16955
  },
  {
    name: '北京卫视1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/bjwshd/4000000/mnf.m3u8',
    id: 16956
  },
  {
    name: '江苏卫视1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/jswshd/4000000/mnf.m3u8',
    id: 16957
  },
  {
    name: '浙江卫视1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/zjwshd/4000000/mnf.m3u8',
    id: 16958
  },
  {
    name: '深圳卫视1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/szwshd/4000000/mnf.m3u8',
    id: 16959
  },
  {
    name: '山东卫视1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/sdwshd/4000000/mnf.m3u8',
    id: 16960
  },
  {
    name: '湖北卫视1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hbwshd/4000000/mnf.m3u8',
    id: 16961
  },
  {
    name: '广东卫视1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/gdwshd/4000000/mnf.m3u8',
    id: 16962
  },
  {
    name: '东方卫视1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hddfws/4000000/mnf.m3u8',
    id: 16963
  },
  {
    name: '黑龙江卫视1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hljwshd/4000000/mnf.m3u8',
    id: 16964
  },
  {
    name: '五星体育1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/ssty/4000000/mnf.m3u8',
    id: 16965
  },
  {
    name: '北京卫视高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/bjwshd/1300000/mnf.m3u8',
    id: 16966
  },
  {
    name: '东方卫视高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hddfws/1300000/mnf.m3u8',
    id: 16967
  },
  {
    name: '浙江卫视高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/zjwshd/1300000/mnf.m3u8',
    id: 16968
  },
  {
    name: '湖北卫视高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hbwshd/1300000/mnf.m3u8',
    id: 16969
  },
  {
    name: '湖南卫视高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hnwshd/1300000/mnf.m3u8',
    id: 16970
  },
  {
    name: '山东卫视高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/sdwshd/1300000/mnf.m3u8',
    id: 16971
  },
  {
    name: '江苏卫视高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/jswshd/1300000/mnf.m3u8',
    id: 16972
  },
  {
    name: '深圳卫视高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/szwshd/1300000/mnf.m3u8',
    id: 16973
  },
  {
    name: '广东卫视高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/gdwshd/1300000/mnf.m3u8',
    id: 16974
  },
  {
    name: '黑龙江卫视高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hljwshd/1300000/mnf.m3u8',
    id: 16975
  },
  {
    name: '湖南卫视HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hnwshd/2300000/mnf.m3u8',
    id: 16976
  },
  {
    name: '北京卫视HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/bjwshd/2300000/mnf.m3u8',
    id: 16977
  },
  {
    name: '江苏卫视HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/jswshd/2300000/mnf.m3u8',
    id: 16978
  },
  {
    name: '浙江卫视HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/zjwshd/2300000/mnf.m3u8',
    id: 16979
  },
  {
    name: '深圳卫视HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/szwshd/2300000/mnf.m3u8',
    id: 16980
  },
  {
    name: '山东卫视HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/sdwshd/2300000/mnf.m3u8',
    id: 16981
  },
  {
    name: '湖北卫视HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hbwshd/2300000/mnf.m3u8',
    id: 16982
  },
  {
    name: '广东卫视HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/gdwshd/2300000/mnf.m3u8',
    id: 16983
  },
  {
    name: '黑龙江卫视HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hljwshd/2300000/mnf.m3u8',
    id: 16984
  },
  {
    name: '五星体育HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/ssty/2300000/mnf.m3u8',
    id: 16985
  },
  {
    name: '中国教育1 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226494/1.m3u8',
    id: 16986
  },
  {
    name: '东南卫视 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226406/1.m3u8',
    id: 16987
  },
  {
    name: '东南卫视 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226496/1.m3u8',
    id: 16988
  },
  {
    name: '东方卫视 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226237/1.m3u8',
    id: 16989
  },
  {
    name: '东方卫视 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226364/1.m3u8',
    id: 16990
  },
  {
    name: '东方卫视 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226505/1.m3u8',
    id: 16991
  },
  {
    name: '北京卫视 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226224/1.m3u8',
    id: 16992
  },
  {
    name: '北京卫视 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226367/1.m3u8',
    id: 16993
  },
  {
    name: '北京卫视 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226441/1.m3u8',
    id: 16994
  },
  {
    name: '天津卫视 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226246/1.m3u8',
    id: 16995
  },
  {
    name: '天津卫视 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226502/1.m3u8',
    id: 16996
  },
  {
    name: '安徽卫视 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226223/1.m3u8',
    id: 16997
  },
  {
    name: '安徽卫视 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226499/1.m3u8',
    id: 16998
  },
  {
    name: '山东卫视 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221225894/1.m3u8',
    id: 16999
  },
  {
    name: '山东卫视 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226244/1.m3u8',
    id: 17000
  },
  {
    name: '山东卫视 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226308/1.m3u8',
    id: 17001
  },
  {
    name: '山东卫视 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226501/1.m3u8',
    id: 17002
  },
  {
    name: '广东卫视 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221225878/1.m3u8',
    id: 17003
  },
  {
    name: '广东卫视 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226238/1.m3u8',
    id: 17004
  },
  {
    name: '广东卫视 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226508/1.m3u8',
    id: 17005
  },
  {
    name: '江苏卫视 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226242/1.m3u8',
    id: 17006
  },
  {
    name: '江苏卫视 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226366/1.m3u8',
    id: 17007
  },
  {
    name: '江苏卫视 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226506/1.m3u8',
    id: 17008
  },
  {
    name: '江西卫视 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226243/1.m3u8',
    id: 17009
  },
  {
    name: '河北卫视 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226507/1.m3u8',
    id: 17010
  },
  {
    name: '浙江卫视 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226247/1.m3u8',
    id: 17011
  },
  {
    name: '浙江卫视 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226365/1.m3u8',
    id: 17012
  },
  {
    name: '浙江卫视 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226504/1.m3u8',
    id: 17013
  },
  {
    name: '深圳卫视 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221225897/1.m3u8',
    id: 17014
  },
  {
    name: '深圳卫视 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226245/1.m3u8',
    id: 17015
  },
  {
    name: '深圳卫视 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226495/1.m3u8',
    id: 17016
  },
  {
    name: '湖北卫视 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226240/1.m3u8',
    id: 17017
  },
  {
    name: '湖北卫视 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226310/1.m3u8',
    id: 17018
  },
  {
    name: '湖北卫视 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226503/1.m3u8',
    id: 17019
  },
  {
    name: '湖南卫视 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226241/1.m3u8',
    id: 17020
  },
  {
    name: '湖南卫视 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226509/1.m3u8',
    id: 17021
  },
  {
    name: '贵州卫视 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226497/1.m3u8',
    id: 17022
  },
  {
    name: '辽宁卫视 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226500/1.m3u8',
    id: 17023
  },
  {
    name: '黑龙江卫视 HD',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226239/1.m3u8',
    id: 17024
  },
  {
    name: '黑龙江卫视 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226498/1.m3u8',
    id: 17025
  },
  {
    name: '北京冬奥纪实 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226438/1.m3u8',
    id: 17026
  },
  {
    name: '北京影视 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226486/1.m3u8',
    id: 17027
  },
  {
    name: '北京文艺 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226440/1.m3u8',
    id: 17028
  },
  {
    name: '北京新闻 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226437/1.m3u8',
    id: 17029
  },
  {
    name: '安徽卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/ahws/1300000/mnf.m3u8',
    id: 17030
  },
  {
    name: '兵团卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/btws/1300000/mnf.m3u8',
    id: 17031
  },
  {
    name: '甘肃卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/gsws/1300000/mnf.m3u8',
    id: 17032
  },
  {
    name: '陕西卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/sxws/1300000/mnf.m3u8',
    id: 17033
  },
  {
    name: '山西卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/shanxiws/1300000/mnf.m3u8',
    id: 17034
  },
  {
    name: '吉林卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/jlws/1300000/mnf.m3u8',
    id: 17035
  },
  {
    name: '河北卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hbws/1300000/mnf.m3u8',
    id: 17036
  },
  {
    name: '四川卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/scws/1300000/mnf.m3u8',
    id: 17037
  },
  {
    name: '贵州卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/gzws/1300000/mnf.m3u8',
    id: 17038
  },
  {
    name: '云南卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/ynws/1300000/mnf.m3u8',
    id: 17039
  },
  {
    name: '辽宁卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/lnws/1300000/mnf.m3u8',
    id: 17040
  },
  {
    name: '旅游卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/lyws/1300000/mnf.m3u8',
    id: 17041
  },
  {
    name: '东南卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/dnws/1300000/mnf.m3u8',
    id: 17042
  },
  {
    name: '重庆卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cqws/1300000/mnf.m3u8',
    id: 17043
  },
  {
    name: '广西卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/gxws/1300000/mnf.m3u8',
    id: 17044
  },
  {
    name: '青海卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/qhws/1300000/mnf.m3u8',
    id: 17045
  },
  {
    name: '江西卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/jxws/1300000/mnf.m3u8',
    id: 17046
  },
  {
    name: '内蒙古卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/nmgws/1300000/mnf.m3u8',
    id: 17047
  },
  {
    name: '天津卫视',
    url: 'http://112.17.40.140/PLTV/88888888/224/3221226412/index.m3u8',
    id: 17048
  },
  {
    name: '河北卫视超清1',
    url: 'http://223.110.245.149/ott.js.chinamobile.com/PLTV/3/224/3221225840/index.m3u8',
    id: 17049
  },
  {
    name: '湖南卫视',
    url: 'http://112.17.40.140/PLTV/88888888/224/3221226553/index.m3u8',
    id: 17050
  },
  {
    name: '浙江卫视',
    url: 'http://223.110.243.173/PLTV/3/224/3221227215/index.m3u8',
    id: 17051
  },
  {
    name: '江苏卫视',
    url: 'http://112.17.40.140/PLTV/88888888/224/3221226414/index.m3u8',
    id: 17052
  },
  {
    name: '东南卫视',
    url: 'http://117.169.124.37:6610/ysten-businessmobile/live/dongnanstv/yst.m3u8',
    id: 17053
  },
  {
    name: '湖北卫视',
    url: 'http://223.110.243.171/PLTV/3/224/3221227211/index.m3u8',
    id: 17054
  },
  {
    name: '广东卫视',
    url: 'http://112.17.40.140/PLTV/88888888/224/3221226225/index.m3u8',
    id: 17055
  },
  {
    name: '深圳卫视',
    url: 'http://223.110.243.171/PLTV/3/224/3221227217/index.m3u8',
    id: 17056
  },
  {
    name: '辽宁卫视',
    url: 'http://223.110.245.145/ott.js.chinamobile.com/PLTV/3/224/3221227410/index.m3u8',
    id: 17057
  },
  {
    name: '龙江卫视',
    url: 'http://112.17.40.140/PLTV/88888888/224/3221226555/index.m3u8',
    id: 17058
  },
  {
    name: '江西卫视',
    url: 'http://112.17.40.140/PLTV/88888888/224/3221226557/index.m3u8',
    id: 17059
  },
  {
    name: '四川卫视',
    url: 'http://ott.fj.chinamobile.com/PLTV/88888888/224/3221227006/1.m3u8',
    id: 17060
  },
  {
    name: '重庆卫视',
    url: 'http://ott.fj.chinamobile.com/PLTV/88888888/224/3221225949/1.m3u8',
    id: 17061
  },
  {
    name: '重庆卫视',
    url: 'http://ivi.bupt.edu.cn/hls/cqhd.m3u8',
    id: 17062
  },
  {
    name: '河南卫视超清2',
    url: 'http://223.110.245.157/ott.js.chinamobile.com/PLTV/3/224/3221225815/index.m3u8',
    id: 17063
  },
  {
    name: '贵州卫视超清2',
    url: 'http://223.110.245.149/ott.js.chinamobile.com/PLTV/3/224/3221225787/index.m3u8',
    id: 17064
  },
  {
    name: '海南卫视',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221225855/1.m3u8',
    id: 17065
  },
  {
    name: '云南卫视超清1',
    url: 'http://223.110.245.159/ott.js.chinamobile.com/PLTV/3/224/3221225838/index.m3u8',
    id: 17066
  },
  {
    name: '宁夏卫视超清1',
    url: 'http://223.110.245.151/ott.js.chinamobile.com/PLTV/3/224/3221225842/index.m3u8',
    id: 17067
  },
  {
    name: '内蒙卫视超清1',
    url: 'http://223.110.245.161/ott.js.chinamobile.com/PLTV/3/224/3221225836/index.m3u8',
    id: 17068
  },
  {
    name: '广西卫视',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221225836/1.m3u8',
    id: 17069
  },
  {
    name: '五星体育HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/ssty/1300000/mnf.m3u8',
    id: 17070
  },
  {
    name: '北京卡酷少儿 CQ',
    url: 'http://221.179.217.9/otttv.bj.chinamobile.com/PLTV/88888888/224/3221226558/1.m3u8',
    id: 17071
  },
  {
    name: '法治天地HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/fztd/1300000/mnf.m3u8',
    id: 17072
  },
  {
    name: '欢笑剧场HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hxjc/1300000/mnf.m3u8',
    id: 17073
  },
  {
    name: '都市剧场HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/dsjc/1300000/mnf.m3u8',
    id: 17074
  },
  {
    name: '七彩戏剧HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/qcxj/1300000/mnf.m3u8',
    id: 17075
  },
  {
    name: '动漫秀场HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/dmxc/1300000/mnf.m3u8',
    id: 17076
  },
  {
    name: '劲爆体育HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/jbty/1300000/mnf.m3u8',
    id: 17077
  },
  {
    name: '极速汽车',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/jsqc/1300000/mnf.m3u8',
    id: 17078
  },
  {
    name: '游戏风云',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/yxfy/1300000/mnf.m3u8',
    id: 17079
  },
  {
    name: '金鹰卡通',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/jykt/1300000/mnf.m3u8',
    id: 17080
  },
  {
    name: '炫动卡通',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/xdkt/1300000/mnf.m3u8',
    id: 17081
  },
  {
    name: '嘉佳卡通',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/jjkt/1300000/mnf.m3u8',
    id: 17082
  },
  {
    name: '星尚',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/shss/1300000/mnf.m3u8',
    id: 17083
  },
  {
    name: '上海纪实',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/jspd/1300000/mnf.m3u8',
    id: 17084
  },
  {
    name: '上海新闻',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/xwzh/1300000/mnf.m3u8',
    id: 17085
  },
  {
    name: '上海娱乐',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/ylpd/1300000/mnf.m3u8',
    id: 17086
  },
  {
    name: '上海电视剧',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/dsjpd/1300000/mnf.m3u8',
    id: 17087
  },
  {
    name: '上海ICS外语频道',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/wypd/1300000/mnf.m3u8',
    id: 17088
  },
  {
    name: '上海艺术人文',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/ysrw/1300000/mnf.m3u8',
    id: 17089
  },
  {
    name: '东方财经浦东',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/dfcj/1300000/mnf.m3u8',
    id: 17090
  },
  {
    name: '第一财经',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/dycj/1300000/mnf.m3u8',
    id: 17091
  },
  {
    name: '直播1-1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hdnba1/4000000/mnf.m3u8',
    id: 17092
  },
  {
    name: '直播2-1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hdnba2/4000000/mnf.m3u8',
    id: 17093
  },
  {
    name: '直播3-1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hdnba3/4000000/mnf.m3u8',
    id: 17094
  },
  {
    name: '直播4-1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hdnba4/4000000/mnf.m3u8',
    id: 17095
  },
  {
    name: '直播5-1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hdnba5/4000000/mnf.m3u8',
    id: 17096
  },
  {
    name: '直播6-1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hdnba6/4000000/mnf.m3u8',
    id: 17097
  },
  {
    name: '直播7-1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hdnba7/4000000/mnf.m3u8',
    id: 17098
  },
  {
    name: '纯享4K源码1',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221226825/1.m3u8',
    id: 17099
  },
  {
    name: '百事4K频道',
    url: 'http://112.17.40.145/PLTV/88888888/224/3221226718/index.m3u8',
    id: 17100
  },
  {
    name: '凤凰资讯',
    url: 'http://112.17.40.140/PLTV/88888888/224/3221226491/index.m3u8',
    id: 17101
  },
  {
    name: '凤凰资讯',
    url: 'http://117.169.124.37:6610/ysten-businessmobile/live/fhzixun/1.m3u8',
    id: 17102
  },
  {
    name: '凤凰中文',
    url: 'http://117.169.124.37:6610/ysten-businessmobile/live/fhchinese/1.m3u8',
    id: 17103
  },
  {
    name: '凤凰中文',
    url: 'http://117.169.120.138:8080/live/fhchinese/index.m3u8',
    id: 17104
  },
  {
    name: '高清影视1台',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221226736/1.m3u8',
    id: 17105
  },
  {
    name: '高清影视2台',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221225881/1.m3u8',
    id: 17106
  },
  {
    name: '高清影视3台',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221226708/1.m3u8',
    id: 17107
  },
  {
    name: '高清影视4台',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221226712/1.m3u8',
    id: 17108
  },
  {
    name: '高清影视5台',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221225893/1.m3u8',
    id: 17109
  },
  {
    name: '高清影视6台',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221226692/1.m3u8',
    id: 17110
  },
  {
    name: '高清影视7台',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221226754/1.m3u8',
    id: 17111
  },
  {
    name: '高清影视8台',
    url: 'http://112.17.40.145/PLTV/88888888/224/3221226608/index.m3u8',
    id: 17112
  },
  {
    name: '高清影视9台',
    url: 'http://112.17.40.145/PLTV/88888888/224/3221226606/index.m3u8',
    id: 17113
  },
  {
    name: '高清影视10台',
    url: 'http://112.17.40.145/PLTV/88888888/224/3221226360/index.m3u8',
    id: 17114
  },
  {
    name: '高清动画11台',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221226732/1.m3u8',
    id: 17115
  },
  {
    name: '高清动画12台',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221226741/1.m3u8',
    id: 17116
  },
  {
    name: '高清动漫13台',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221226743/1.m3u8',
    id: 17117
  },
  {
    name: '高清影视14台',
    url: 'http://ivi.bupt.edu.cn/hls/chchd.m3u8',
    id: 17118
  },
  {
    name: '北京纪实高清',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221225944/1.m3u8',
    id: 17119
  },
  {
    name: '峨眉电影高清',
    url: 'http://scgctvshow.sctv.com/hdlive/emei/1.m3u8',
    id: 17120
  },
  {
    name: '欢笑剧场高清',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221226729/1.m3u8',
    id: 17121
  },
  {
    name: '纪实频道高清',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221225946/1.m3u8',
    id: 17122
  },
  {
    name: '极速汽车高清',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221226140/1.m3u8',
    id: 17123
  },
  {
    name: '动漫秀场高清',
    url: 'http://112.50.243.8/PLTV/88888888/224/3221226141/1.m3u8',
    id: 17124
  },
  {
    name: '求索纪录',
    url: 'http://112.17.40.145/PLTV/88888888/224/3221226610/index.m3u8',
    id: 17125
  },
  {
    name: '求索科学',
    url: 'http://125.210.152.18:9090/live/QSKX_1200.m3u8',
    id: 17126
  },
  {
    name: '求索动物',
    url: 'http://125.210.152.18:9090/live/QSDW_1200.m3u8',
    id: 17127
  },
  {
    name: '求索生活',
    url: 'http://125.210.152.18:9090/live/QSSH_1200.m3u8',
    id: 17128
  },
  {
    name: '日本天気预报',
    url: 'http://movie.mcas.jp/mcas/wn1_2/master.m3u8',
    id: 17129
  },
  {
    name: '奥林匹克高清',
    url: 'http://ott-live.olympicchannel.com/out/u/OC1_2.m3u8?fluxustv.m3u8',
    id: 17130
  },
  {
    name: '奥铃匹克高清',
    url: 'http://ott-live.olympicchannel.com/out/u/OC1_1.m3u8?fluxustv.m3u8',
    id: 17131
  },
  {
    name: '爱青春',
    url: 'http://112.17.40.140/hwltc.tv.cdn.zj.chinamobile.com/PLTV/88888888/224/3221230130/index.m3u8',
    id: 17132
  },
  {
    name: '爱家庭',
    url: 'http://112.17.40.140/hwltc.tv.cdn.zj.chinamobile.com/PLTV/88888888/224/3221230118/index.m3u8',
    id: 17133
  },
  {
    name: '爱探索',
    url: 'http://112.17.40.140/hwltc.tv.cdn.zj.chinamobile.com/PLTV/88888888/224/3221230112/index.m3u8',
    id: 17134
  },
  {
    name: '爱科学',
    url: 'http://112.17.40.140/hwltc.tv.cdn.zj.chinamobile.com/PLTV/88888888/224/3221230106/index.m3u8',
    id: 17135
  },
  {
    name: '爱猎奇',
    url: 'http://112.17.40.140/hwltc.tv.cdn.zj.chinamobile.com/PLTV/88888888/224/3221230097/index.m3u8',
    id: 17136
  },
  {
    name: '爱谍战',
    url: 'http://112.17.40.140/hwltc.tv.cdn.zj.chinamobile.com/PLTV/88888888/224/3221230092/index.m3u8',
    id: 17137
  },
  {
    name: '爱娱乐',
    url: 'http://112.17.40.140/hwltc.tv.cdn.zj.chinamobile.com/PLTV/88888888/224/3221230077/index.m3u8',
    id: 17138
  },
  {
    name: '爱旅行',
    url: 'http://112.17.40.140/hwltc.tv.cdn.zj.chinamobile.com/PLTV/88888888/224/3221230052/index.m3u8',
    id: 17139
  },
  {
    name: '爱怀旧',
    url: 'http://112.17.40.140/hwltc.tv.cdn.zj.chinamobile.com/PLTV/88888888/224/3221230049/index.m3u8',
    id: 17140
  },
  {
    name: '爱体育',
    url: 'http://112.17.40.140/hwltc.tv.cdn.zj.chinamobile.com/PLTV/88888888/224/3221230034/index.m3u8',
    id: 17141
  },
  {
    name: '爱赛车',
    url: 'http://112.17.40.140/hwltc.tv.cdn.zj.chinamobile.com/PLTV/88888888/224/3221230032/index.m3u8',
    id: 17142
  },
  {
    name: '北京少儿',
    url: 'http://ivi.bupt.edu.cn/hls/btv10.m3u8',
    id: 17143
  },
  {
    name: '动漫电影',
    url: 'http://112.17.40.140/PLTV/88888888/224/3221226178/index.m3u8',
    id: 17144
  },
  {
    name: '重庆少儿',
    url: 'http://219.153.252.50/PLTV/88888888/224/3221225646/1.m3u8',
    id: 17145
  },
  {
    name: '嘉佳卡通',
    url: 'http://112.17.40.140/PLTV/88888888/224/3221226461/index.m3u8',
    id: 17146
  },
  {
    name: '耀才财经',
    url: 'http://202.69.67.66:443/webcast/bshdlive-mobile/playlist.m3u8',
    id: 17147
  },
  {
    name: '亚旅卫视',
    url: 'http://hls.jingchangkan.tv/jingchangkan/156722438_0HaM/index.m3u8',
    id: 17148
  },
  {
    name: '信吉电视',
    url: 'http://220.130.241.203:1935/sjtv/livestream_360p/playlist.m3u8',
    id: 17149
  },
  {
    name: '唯心電視',
    url: 'http://mobile.ccdntech.com/transcoder/_definst_/vod164_Live/live/chunklist_w1177047531.m3u8',
    id: 17150
  },
  {
    name: '百事通台',
    url: 'http://112.17.40.145/PLTV/88888888/224/3221226596/index.m3u8',
    id: 17151
  },
  {
    name: 'HBO2台',
    url: 'http://161.0.157.5/PLTV/88888888/224/3221227026/03.m3u8？fluxustv.m3u8',
    id: 17152
  },
  {
    name: '点掌财经',
    url: 'http://cclive2.aniu.tv/live/anzb.m3u8',
    id: 17153
  },
  {
    name: '日本NHK华语',
    url: 'https://nhkw-zh-hlscomp.akamaized.net/ixxemlzk1vqvy44o/playlist.m3u8',
    id: 17154
  },
  {
    name: '日本NHK英语',
    url: 'https://nhkwlive-ojp.akamaized.net/hls/live/2003459/nhkwlive-ojp/index_1M.m3u8',
    id: 17155
  },
  {
    name: '日本Japan News 24',
    url: 'http://www.news24.jp/livestream/index.m3u8',
    id: 17156
  },
  {
    name: '日本JapanetChannelDX',
    url: 'http://bcsecurelivehls-i.akamaihd.net/hls/live/265320/5043843989001/140130JTDX/index_1200.m3u8',
    id: 17157
  },
  {
    name: '日本QVC',
    url: 'http://cdn-live1.qvc.jp/iPhone/800/800.m3u8',
    id: 17158
  },
  {
    name: '韩国EBS 第一频道',
    url: 'http://ebsonairios.ebs.co.kr/groundwavetablet500k/tablet500k/playlist.m3u8',
    id: 17159
  },
  {
    name: '韩国EBS 少儿频道',
    url: 'http://ebsonairios.ebs.co.kr/ebsutablet500k/tablet500k/playlist.m3u8',
    id: 17160
  },
  {
    name: '韩国KCTV',
    url: 'http://119.77.96.184:1935/chn21/chn21/chunklist_w252131137.m3u8',
    id: 17161
  },
  {
    name: '朝鲜中央台',
    url: 'http://119.77.96.184:1935/chn05/chn05/chunklist_w644291506.m3u8',
    id: 17162
  },
  {
    name: '韩国KTV 韩国电视',
    url: 'http://218.38.152.31:1935/klive/klive.stream/playlist.m3u8',
    id: 17163
  },
  {
    name: '韩国EBS 儿童频道',
    url: 'http://ebsonairios.ebs.co.kr/ebsutablet500k/_definst_/tablet500k/chunklist_w1965791004.m3u8',
    id: 17164
  },
  {
    name: '韩国阿里郎WORLDworld',
    url: 'http://amdlive.ctnd.com.edgesuite.net/arirang_1ch/smil:arirang_1ch.smil/playlist.m3u8',
    id: 17165
  },
  {
    name: '韩国阿里郎WORLD',
    url: 'http://amdlive.ctnd.com.edgesuite.net/arirang_1ch/smil:arirang_1ch/master.m3u8',
    id: 17166
  },
  {
    name: 'KOREA YTN Science',
    url: 'http://slive.sciencetv.kr:1935/science/yslive_20140419_1/playlist.m3u8',
    id: 17167
  },
  {
    name: 'Luxury World',
    url: 'http://nano.teleservice.su:8080/hls/luxury.m3u8',
    id: 17168
  },
  {
    name: '韩国BBS佛教广播',
    url: 'http://bbstv.clouducs.com:1935/bbstv-live/livestream/chunklist_w1403706733.m3u8',
    id: 17169
  },
  {
    name: 'CPAC',
    url: 'http://bcoveliveios-i.akamaihd.net/hls/live/248519/1242843915001_1/master.m3u8',
    id: 17170
  },
  {
    name: '中国环球',
    url: 'http://live.cgtn.com/1000/prog_index.m3u8',
    id: 17171
  },
  {
    name: '狗狗宠物',
    url: 'http://video.blivenyc.com/broadcast/prod/2061/22/file-3192k.m3u8',
    id: 17172
  },
  {
    name: '法国时尚',
    url: 'http://lb.streaming.sk/fashiontv/stream/chunklist_w1702070444.m3u8',
    id: 17173
  },
  {
    name: '亚洲新闻',
    url: 'http://d2e1asnsl7br7b.cloudfront.net/7782e205e72f43aeb4a48ec97f66ebbe/index_4.m3u8',
    id: 17174
  },
  {
    name: '越南人民报',
    url: 'http://vietcago.net/vstv/thnd.m3u8',
    id: 17175
  },
  {
    name: '印度音乐电视',
    url: 'http://104.237.60.234/live/gabruutv.m3u8?dsjtv.m3u8',
    id: 17176
  },
  {
    name: '法国第五世界台',
    url: 'http://v3plusinfo247hls-i.akamaihd.net/hls/live/218877-b/v3plusinfo247hls/v3plusinfo247hls_1_1.m3u8',
    id: 17177
  },
  {
    name: '俄罗斯HD时尚频道',
    url: 'http://95.67.47.115/hls/hdfashion_ua_hi/index.m3u8',
    id: 17178
  },
  {
    name: '乌克兰M2 音乐频道',
    url: 'http://live.m2.tv/hls3/stream.m3u8',
    id: 17179
  },
  {
    name: '西班牙中国环球',
    url: 'http://livees.cgtn.com/1000e/prog_index.m3u8',
    id: 17180
  },
  {
    name: '意大利意大利电台',
    url: 'http://radioitaliatv-lh.akamaihd.net/i/radioitaliatv_1@329645/index_720x480_av-p.m3u8',
    id: 17181
  },
  {
    name: '意大利V2 音乐频道',
    url: 'http://de1se01.v2beat.live/playlist.m3u8',
    id: 17182
  },
  {
    name: '墨西哥墨西哥电视',
    url: 'http://bcoveliveios-i.akamaihd.net/hls/live/201661/57828478001/milenio_center_512k@51752.m3u8',
    id: 17183
  },
  {
    name: '音乐20TV',
    url: 'http://m2otv-lh.akamaihd.net/i/m2oTv_1@186074/index_600_av-p.m3u8',
    id: 17184
  },
  {
    name: '当红MTV',
    url: 'http://unilivemtveu-lh.akamaihd.net/i/mtvno_1@346424/index_3500_av-b.m3u8',
    id: 17185
  },
  {
    name: '酷酷频道',
    url: 'http://edge1.tikilive.com:1935/unrestricted_tikilive/25947/amlst:NWKlw6jwyXpz/chunklist_w981409619_b1105254.m3u8?fluxustv.m3u8',
    id: 17186
  },
  {
    name: '红牛电视',
    url: 'http://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master_1660.m3u8',
    id: 17187
  },
  {
    name: 'NBC电视',
    url: 'http://161.0.157.51/PLTV/88888888/224/3221227040/index.m3u8?fluxustv.m3u8',
    id: 17188
  },
  {
    name: 'Jewelry电视',
    url: 'http://wowzaprod134-i.akamaihd.net/hls/live/577814/ccddaf02/playlist.m3u8',
    id: 17189
  },
  {
    name: 'Darcizzle电视',
    url: 'http://30a-tv.com/darcizzle.m3u8',
    id: 17190
  },
  {
    name: 'CBS新闻',
    url: 'http://cbsnewshd-lh.akamaihd.net/i/CBSNHD_7@199302/master.m3u8',
    id: 17191
  },
  {
    name: '美国Deutsche Welle',
    url: 'http://dwstream4-lh.akamaihd.net/i/dwstream4_live@131329/master.m3u8',
    id: 17192
  },
  {
    name: '美国360 North',
    url: 'http://wowzaprod3-i.akamaihd.net/hls/live/252236/2147483647_360north_247/playlist.m3u8',
    id: 17193
  },
  {
    name: '美国Fox News Talk Radio',
    url: 'http://fnurtmp-f.akamaihd.net/i/FNRADIO_1@92141/master.m3u8',
    id: 17194
  },
  {
    name: '日本cgntv',
    url: 'http://cgntv-glive.ofsdelivery.net/live/_definst_/cgntv_jp/playlist.m3u8',
    id: 17195
  },
  {
    name: '日本Japanet Channel DX',
    url: 'http://bcsecurelivehls-i.akamaihd.net/hls/live/265320/5043843989001/140130JTDX/index_600.m3u8',
    id: 17196
  }
]

export {
  setting,
  sites,
  iptv,
  localKey,
  getSite
}
