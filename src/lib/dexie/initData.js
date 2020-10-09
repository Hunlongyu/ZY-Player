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
    id: 5910
  },
  {
    name: '北京卫视1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/bjwshd/4000000/mnf.m3u8',
    id: 5911
  },
  {
    name: '江苏卫视1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/jswshd/4000000/mnf.m3u8',
    id: 5912
  },
  {
    name: '浙江卫视1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/zjwshd/4000000/mnf.m3u8',
    id: 5913
  },
  {
    name: '深圳卫视1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/szwshd/4000000/mnf.m3u8',
    id: 5914
  },
  {
    name: '山东卫视1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/sdwshd/4000000/mnf.m3u8',
    id: 5915
  },
  {
    name: '湖北卫视1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hbwshd/4000000/mnf.m3u8',
    id: 5916
  },
  {
    name: '广东卫视1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/gdwshd/4000000/mnf.m3u8',
    id: 5917
  },
  {
    name: '东方卫视1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hddfws/4000000/mnf.m3u8',
    id: 5918
  },
  {
    name: '黑龙江卫视1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hljwshd/4000000/mnf.m3u8',
    id: 5919
  },
  {
    name: '五星体育1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/ssty/4000000/mnf.m3u8',
    id: 5920
  },
  {
    name: '上海Knews24 1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hdnba8/4000000/mnf.m3u8',
    id: 5921
  },
  {
    name: 'CCTV-1HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cctv1hd/2300000/mnf.m3u8',
    id: 5922
  },
  {
    name: 'CCTV-2',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cctv2/1300000/mnf.m3u8',
    id: 5923
  },
  {
    name: 'CCTV-3',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cctv3/1300000/mnf.m3u8',
    id: 5924
  },
  {
    name: 'CCTV-4',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cctv4/1300000/mnf.m3u8',
    id: 5925
  },
  {
    name: 'CCTV-5',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cctv5/1300000/mnf.m3u8',
    id: 5926
  },
  {
    name: 'CCTV-6',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cctv6/1300000/mnf.m3u8',
    id: 5927
  },
  {
    name: 'CCTV-7',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cctv7/1300000/mnf.m3u8',
    id: 5928
  },
  {
    name: 'CCTV-8',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cctv8/1300000/mnf.m3u8',
    id: 5929
  },
  {
    name: 'CCTV-10',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cctv10/1300000/mnf.m3u8',
    id: 5930
  },
  {
    name: 'CCTV-11',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cctv11/1300000/mnf.m3u8',
    id: 5931
  },
  {
    name: 'CCTV-12',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cctv12/1300000/mnf.m3u8',
    id: 5932
  },
  {
    name: 'CCTV-13',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cctvxw/1300000/mnf.m3u8',
    id: 5933
  },
  {
    name: 'CCTV-14',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cctvse//1300000/mnf.m3u8',
    id: 5934
  },
  {
    name: 'CCTV-15',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cctvyy/1300000/mnf.m3u8',
    id: 5935
  },
  {
    name: '北京卫视高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/bjwshd/1300000/mnf.m3u8',
    id: 5936
  },
  {
    name: '东方卫视高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hddfws/1300000/mnf.m3u8',
    id: 5937
  },
  {
    name: '浙江卫视高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/zjwshd/1300000/mnf.m3u8',
    id: 5938
  },
  {
    name: '湖北卫视高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hbwshd/1300000/mnf.m3u8',
    id: 5939
  },
  {
    name: '湖南卫视高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hnwshd/1300000/mnf.m3u8',
    id: 5940
  },
  {
    name: '山东卫视高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/sdwshd/1300000/mnf.m3u8',
    id: 5941
  },
  {
    name: '江苏卫视高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/jswshd/1300000/mnf.m3u8',
    id: 5942
  },
  {
    name: '深圳卫视高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/szwshd/1300000/mnf.m3u8',
    id: 5943
  },
  {
    name: '广东卫视高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/gdwshd/1300000/mnf.m3u8',
    id: 5944
  },
  {
    name: '黑龙江卫视高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hljwshd/1300000/mnf.m3u8',
    id: 5945
  },
  {
    name: '五星体育高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/ssty/1300000/mnf.m3u8',
    id: 5946
  },
  {
    name: '新闻24高清',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hdnba8/1300000/mnf.m3u8',
    id: 5947
  },
  {
    name: '湖南卫视HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hnwshd/2300000/mnf.m3u8',
    id: 5948
  },
  {
    name: '北京卫视HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/bjwshd/2300000/mnf.m3u8',
    id: 5949
  },
  {
    name: '江苏卫视HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/jswshd/2300000/mnf.m3u8',
    id: 5950
  },
  {
    name: '浙江卫视HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/zjwshd/2300000/mnf.m3u8',
    id: 5951
  },
  {
    name: '深圳卫视HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/szwshd/2300000/mnf.m3u8',
    id: 5952
  },
  {
    name: '山东卫视HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/sdwshd/2300000/mnf.m3u8',
    id: 5953
  },
  {
    name: '湖北卫视HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hbwshd/2300000/mnf.m3u8',
    id: 5954
  },
  {
    name: '广东卫视HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/gdwshd/2300000/mnf.m3u8',
    id: 5955
  },
  {
    name: '黑龙江卫视HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hljwshd/2300000/mnf.m3u8',
    id: 5956
  },
  {
    name: '五星体育HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/ssty/2300000/mnf.m3u8',
    id: 5957
  },
  {
    name: '法治天地HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/fztd/1300000/mnf.m3u8',
    id: 5958
  },
  {
    name: '欢笑剧场HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hxjc/1300000/mnf.m3u8',
    id: 5959
  },
  {
    name: '都市剧场HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/dsjc/1300000/mnf.m3u8',
    id: 5960
  },
  {
    name: '七彩戏剧HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/qcxj/1300000/mnf.m3u8',
    id: 5961
  },
  {
    name: '动漫秀场HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/dmxc/1300000/mnf.m3u8',
    id: 5962
  },
  {
    name: '劲爆体育HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/jbty/1300000/mnf.m3u8',
    id: 5963
  },
  {
    name: '极速汽车',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/jsqc/1300000/mnf.m3u8',
    id: 5964
  },
  {
    name: '游戏风云',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/yxfy/1300000/mnf.m3u8',
    id: 5965
  },
  {
    name: '金鹰卡通',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/jykt/1300000/mnf.m3u8',
    id: 5966
  },
  {
    name: '炫动卡通',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/xdkt/1300000/mnf.m3u8',
    id: 5967
  },
  {
    name: '嘉佳卡通',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/jjkt/1300000/mnf.m3u8',
    id: 5968
  },
  {
    name: '星尚',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/shss/1300000/mnf.m3u8',
    id: 5969
  },
  {
    name: '上海纪实',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/jspd/1300000/mnf.m3u8',
    id: 5970
  },
  {
    name: '上海新闻',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/xwzh/1300000/mnf.m3u8',
    id: 5971
  },
  {
    name: '上海娱乐',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/ylpd/1300000/mnf.m3u8',
    id: 5972
  },
  {
    name: '上海电视剧',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/dsjpd/1300000/mnf.m3u8',
    id: 5973
  },
  {
    name: '上海ICS外语频道',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/wypd/1300000/mnf.m3u8',
    id: 5974
  },
  {
    name: '上海艺术人文',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/ysrw/1300000/mnf.m3u8',
    id: 5975
  },
  {
    name: '东方财经浦东',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/dfcj/1300000/mnf.m3u8',
    id: 5976
  },
  {
    name: '第一财经',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/dycj/1300000/mnf.m3u8',
    id: 5977
  },
  {
    name: '安徽卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/ahws/1300000/mnf.m3u8',
    id: 5978
  },
  {
    name: '兵团卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/btws/1300000/mnf.m3u8',
    id: 5979
  },
  {
    name: '甘肃卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/gsws/1300000/mnf.m3u8',
    id: 5980
  },
  {
    name: '陕西卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/sxws/1300000/mnf.m3u8',
    id: 5981
  },
  {
    name: '山西卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/shanxiws/1300000/mnf.m3u8',
    id: 5982
  },
  {
    name: '吉林卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/jlws/1300000/mnf.m3u8',
    id: 5983
  },
  {
    name: '河北卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hbws/1300000/mnf.m3u8',
    id: 5984
  },
  {
    name: '四川卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/scws/1300000/mnf.m3u8',
    id: 5985
  },
  {
    name: '贵州卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/gzws/1300000/mnf.m3u8',
    id: 5986
  },
  {
    name: '云南卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/ynws/1300000/mnf.m3u8',
    id: 5987
  },
  {
    name: '辽宁卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/lnws/1300000/mnf.m3u8',
    id: 5988
  },
  {
    name: '旅游卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/lyws/1300000/mnf.m3u8',
    id: 5989
  },
  {
    name: '东南卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/dnws/1300000/mnf.m3u8',
    id: 5990
  },
  {
    name: '重庆卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/cqws/1300000/mnf.m3u8',
    id: 5991
  },
  {
    name: '广西卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/gxws/1300000/mnf.m3u8',
    id: 5992
  },
  {
    name: '青海卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/qhws/1300000/mnf.m3u8',
    id: 5993
  },
  {
    name: '江西卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/jxws/1300000/mnf.m3u8',
    id: 5994
  },
  {
    name: '内蒙古卫视',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/nmgws/1300000/mnf.m3u8',
    id: 5995
  },
  {
    name: '五星体育HD',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/ssty/1300000/mnf.m3u8',
    id: 5996
  },
  {
    name: '直播1-1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hdnba1/4000000/mnf.m3u8',
    id: 5997
  },
  {
    name: '直播2-1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hdnba2/4000000/mnf.m3u8',
    id: 5998
  },
  {
    name: '直播3-1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hdnba3/4000000/mnf.m3u8',
    id: 5999
  },
  {
    name: '直播4-1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hdnba4/4000000/mnf.m3u8',
    id: 6000
  },
  {
    name: '直播5-1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hdnba5/4000000/mnf.m3u8',
    id: 6001
  },
  {
    name: '直播6-1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hdnba6/4000000/mnf.m3u8',
    id: 6002
  },
  {
    name: '直播7-1080P',
    url: 'http://keonline.shanghai.liveplay.qq.com/live/program/live/hdnba7/4000000/mnf.m3u8',
    id: 6003
  }
]

export {
  setting,
  sites,
  iptv,
  localKey,
  getSite
}
