const sites = [
  {
    key: 'zuidazy',
    name: '最大资源网',
    url: 'http://www.zuidazy5.com',
    new: 'http://www.zuidazy5.com/?m=vod-index-pg-{page}.html',
    view: 'http://www.zuidazy5.com/?m=vod-type-id-{id}-page-{page}.html',
    search: 'http://www.zuidazy5.com/index.php?m=vod-search-pg-{page}-wd-{keywords}.html',
    type: 0,
    tags: [
      {
        title: '最新',
        id: 0,
        children: []
      },
      {
        title: '电影',
        id: 1,
        children: [
          {
            title: '动作片',
            id: 5
          },
          {
            title: '喜剧片',
            id: 6
          },
          {
            title: '爱情片',
            id: 7
          },
          {
            title: '科幻片',
            id: 8
          },
          {
            title: '恐怖片',
            id: 9
          },
          {
            title: '剧情片',
            id: 10
          },
          {
            title: '战争片',
            id: 11
          },
          {
            title: '纪录片',
            id: 22
          }
        ]
      },
      {
        title: '连续剧',
        id: 2,
        children: [
          {
            title: '国产剧',
            id: 12
          },
          {
            title: '香港剧',
            id: 13
          },
          {
            title: '韩国剧',
            id: 14
          },
          {
            title: '欧美剧',
            id: 15
          },
          {
            title: '台湾剧',
            id: 19
          },
          {
            title: '日本剧',
            id: 20
          },
          {
            title: '海外剧',
            id: 21
          }
        ]
      },
      {
        title: '综艺片',
        id: 3,
        children: []
      },
      {
        title: '动漫片',
        id: 4,
        children: []
      },
      {
        title: '福利片',
        id: 16,
        children: []
      },
      {
        title: '伦理片',
        id: 17,
        children: []
      },
      {
        title: '音乐片',
        id: 18,
        children: []
      }
    ]
  },
  {
    key: 'subo',
    name: '速播资源站',
    url: 'https://www.subo988.com',
    new: 'https://www.subo988.com/?m=vod-index-pg-{page}.html',
    view: 'https://www.subo988.com/?m=vod-type-id-{id}-pg-{page}.html',
    search: 'https://www.subo988.com/index.php?m=vod-search-pg-{page}-wd-{keywords}.html',
    type: 0,
    tags: [
      {
        title: '最新',
        id: 0,
        children: []
      },
      {
        title: '电影',
        id: 1,
        children: [
          {
            title: '动作片',
            id: 5
          },
          {
            title: '喜剧片',
            id: 6
          },
          {
            title: '爱情片',
            id: 7
          },
          {
            title: '科幻片',
            id: 8
          },
          {
            title: '恐怖片',
            id: 9
          },
          {
            title: '剧情片',
            id: 10
          },
          {
            title: '战争片',
            id: 11
          },
          {
            title: '伦理片',
            id: 16
          }
        ]
      },
      {
        title: '连续剧',
        id: 2,
        children: [
          {
            title: '国产剧',
            id: 12
          },
          {
            title: '香港剧',
            id: 13
          },
          {
            title: '日本剧',
            id: 14
          },
          {
            title: '欧美剧',
            id: 15
          },
          {
            title: '台湾剧',
            id: 17
          },
          {
            title: '韩国剧',
            id: 18
          },
          {
            title: '海外剧',
            id: 19
          }
        ]
      },
      {
        title: '综艺',
        id: 3,
        children: []
      },
      {
        title: '动漫',
        id: 4,
        children: []
      },
      {
        title: '音乐MV',
        id: 20,
        children: []
      }
    ]
  },
  {
    key: 'zuixinzy',
    name: '最新资源网',
    url: 'http://www.zuixinzy.net',
    new: 'http://www.zuixinzy.net/?m=vod-index-pg-{page}.html',
    view: 'http://www.zuixinzy.net/?m=vod-type-id-{id}-pg-{page}.html',
    search: 'http://www.zuixinzy.net/index.php?m=vod-search-pg-{page}-wd-{keywords}.html',
    type: 0,
    tags: [
      {
        title: '最新',
        id: 0,
        children: []
      },
      {
        title: '电影',
        id: 1,
        children: [
          {
            title: '动作片',
            id: 5
          },
          {
            title: '喜剧片',
            id: 6
          },
          {
            title: '爱情片',
            id: 7
          },
          {
            title: '科幻片',
            id: 8
          },
          {
            title: '恐怖片',
            id: 9
          },
          {
            title: '剧情片',
            id: 10
          },
          {
            title: '战争片',
            id: 11
          },
          {
            title: '传记片',
            id: 27
          },
          {
            title: '纪录片',
            id: 19
          },
          {
            title: '伦理片',
            id: 21
          },
          {
            title: '犯罪片',
            id: 22
          },
          {
            title: '情色片',
            id: 23
          },
          {
            title: '奇幻片',
            id: 24
          },
          {
            title: '惊悚片',
            id: 25
          },
          {
            title: '悬疑片',
            id: 28
          }
        ]
      },
      {
        title: '连续剧',
        id: 2,
        children: [
          {
            title: '国产剧',
            id: 12
          },
          {
            title: '香港剧',
            id: 13
          },
          {
            title: '韩国剧',
            id: 14
          },
          {
            title: '欧美剧',
            id: 15
          },
          {
            title: '台湾剧',
            id: 16
          },
          {
            title: '日本剧',
            id: 17
          },
          {
            title: '海外剧',
            id: 18
          }
        ]
      },
      {
        title: '综艺片',
        id: 3,
        children: []
      },
      {
        title: '动漫片',
        id: 4,
        children: []
      },
      {
        title: '福利片',
        id: 30,
        children: []
      },
      {
        title: '解说',
        id: 34,
        children: []
      }
    ]
  },
  {
    key: '123ku',
    name: '123资源网',
    url: 'https://www.123ku.com',
    new: 'https://www.123ku.com/?m=vod-index-pg-{page}.html',
    view: 'https://www.123ku.com/?m=vod-type-id-{id}-pg-{page}.html',
    search: 'https://www.123ku.com/index.php?m=vod-search-pg-{page}-wd-{keywords}.html',
    type: 0,
    tags: [
      {
        title: '最新',
        id: 0,
        children: []
      },
      {
        title: '电影',
        id: 1,
        children: [
          {
            title: '动作片',
            id: 5
          },
          {
            title: '喜剧片',
            id: 6
          },
          {
            title: '爱情片',
            id: 7
          },
          {
            title: '科幻片',
            id: 8
          },
          {
            title: '恐怖片',
            id: 9
          },
          {
            title: '剧情片',
            id: 10
          },
          {
            title: '战争片',
            id: 11
          },
          {
            title: '伦理片',
            id: 16
          }
        ]
      },
      {
        title: '电视剧',
        id: 2,
        children: [
          {
            title: '国产剧',
            id: 12
          },
          {
            title: '香港剧',
            id: 13
          },
          {
            title: '韩国剧',
            id: 14
          },
          {
            title: '美国剧',
            id: 15
          },
          {
            title: '海外剧',
            id: 17
          },
          {
            title: '台湾剧',
            id: 18
          },
          {
            title: '日本剧',
            id: 19
          },
          {
            title: '泰国剧',
            id: 21
          }
        ]
      },
      {
        title: '综艺',
        id: 3,
        children: []
      },
      {
        title: '动漫',
        id: 4,
        children: []
      }
    ]
  },
  {
    key: '209zy',
    name: '209资源网',
    url: 'http://www.209zy.com',
    new: 'http://www.209zy.com/?m=vod-index-pg-{page}.html',
    view: 'http://www.209zy.com/?m=vod-type-id-{id}-pg-{page}.html',
    search: 'http://www.209zy.com/index.php?m=vod-search-pg-{page}-wd-{keywords}.html',
    type: 0,
    tags: [
      {
        title: '最新',
        id: 0,
        children: []
      },
      {
        title: '电影',
        id: 1,
        children: [
          {
            title: '动作片',
            id: 5
          },
          {
            title: '喜剧片',
            id: 6
          },
          {
            title: '爱情片',
            id: 7
          },
          {
            title: '科幻片',
            id: 8
          },
          {
            title: '恐怖片',
            id: 9
          },
          {
            title: '剧情片',
            id: 10
          },
          {
            title: '战争片',
            id: 11
          },
          {
            title: '伦理片',
            id: 16
          },
          {
            title: '纪录片',
            id: 25
          },
          {
            title: '奇幻片',
            id: 26
          }
        ]
      },
      {
        title: '连续剧',
        id: 2,
        children: [
          {
            title: '国产剧',
            id: 12
          },
          {
            title: '港剧',
            id: 13
          },
          {
            title: '韩剧',
            id: 14
          },
          {
            title: '欧美剧',
            id: 15
          },
          {
            title: '日剧',
            id: 20
          },
          {
            title: '台剧',
            id: 21
          },
          {
            title: '泰剧',
            id: 22
          },
          {
            title: '越南剧',
            id: 23
          }
        ]
      },
      {
        title: '综艺',
        id: 3,
        children: []
      },
      {
        title: '动漫',
        id: 4,
        children: []
      }
    ]
  },
  {
    key: '265zy',
    name: '超快资源网',
    url: 'http://265zy.cc',
    new: 'http://265zy.cc/?m=vod-index-pg-{page}.html',
    view: 'http://265zy.cc/?m=vod-type-id-{id}-pg-{page}.html',
    search: 'http://265zy.cc/index.php?m=vod-search-pg-{page}-wd-{keywords}.html',
    type: 0,
    tags: [
      {
        title: '最新',
        id: 0,
        children: []
      },
      {
        title: '电影',
        id: 1,
        children: [
          {
            title: '动作片',
            id: 5
          },
          {
            title: '喜剧片',
            id: 6
          },
          {
            title: '爱情片',
            id: 7
          },
          {
            title: '科幻片',
            id: 8
          },
          {
            title: '恐怖片',
            id: 9
          },
          {
            title: '剧情片',
            id: 10
          },
          {
            title: '战争片',
            id: 11
          },
          {
            title: '动画片',
            id: 20
          },
          {
            title: '伦理片',
            id: 21
          },
          {
            title: '纪录片',
            id: 22
          },
          {
            title: '写真片',
            id: 26
          },
          {
            title: '粤语片',
            id: 28
          },
          {
            title: '奇幻片',
            id: 30
          },
          {
            title: '悬疑片',
            id: 31
          },
          {
            title: '犯罪片',
            id: 32
          },
          {
            title: '惊悚片',
            id: 33
          }
        ]
      },
      {
        title: '连续剧',
        id: 2,
        children: [
          {
            title: '国产剧',
            id: 12
          },
          {
            title: '港剧',
            id: 13
          },
          {
            title: '韩剧',
            id: 14
          },
          {
            title: '美剧',
            id: 15
          },
          {
            title: '台剧',
            id: 16
          },
          {
            title: '日剧',
            id: 17
          },
          {
            title: '泰剧',
            id: 18
          },
          {
            title: '海外剧',
            id: 23
          }
        ]
      },
      {
        title: '综艺',
        id: 3,
        children: []
      },
      {
        title: '动漫',
        id: 4,
        children: []
      },
      {
        title: '微电影',
        id: 29,
        children: []
      }
    ]
  },
  {
    key: '666zy',
    name: '哈酷资源网',
    url: 'http://www.666zy.com',
    new: 'http://www.666zy.com/?m=vod-index-pg-{page}.html',
    view: 'http://www.666zy.com/?m=vod-type-id-{id}-pg-{page}.html',
    search: 'http://www.666zy.com/index.php?m=vod-search-pg-{page}-wd-{keywords}.html',
    type: 0,
    tags: [
      {
        title: '最新',
        id: 0,
        children: []
      },
      {
        title: '电影',
        id: 1,
        children: [
          {
            title: '动作片',
            id: 5
          },
          {
            title: '喜剧片',
            id: 6
          },
          {
            title: '爱情片',
            id: 7
          },
          {
            title: '科幻片',
            id: 8
          },
          {
            title: '恐怖片',
            id: 9
          },
          {
            title: '剧情片',
            id: 10
          },
          {
            title: '战争片',
            id: 11
          },
          {
            title: '动画片',
            id: 20
          },
          {
            title: '伦理片',
            id: 21
          },
          {
            title: '写真片',
            id: 26
          },
          {
            title: '粤语片',
            id: 28
          }
        ]
      },
      {
        title: '连续剧',
        id: 2,
        children: [
          {
            title: '国产剧',
            id: 12
          },
          {
            title: '港剧',
            id: 13
          },
          {
            title: '韩剧',
            id: 14
          },
          {
            title: '美剧',
            id: 15
          },
          {
            title: '台剧',
            id: 16
          },
          {
            title: '日剧',
            id: 17
          },
          {
            title: '泰剧',
            id: 19
          },
          {
            title: '海外剧',
            id: 23
          }
        ]
      },
      {
        title: '综艺',
        id: 3,
        children: [
          {
            title: '大陆综艺',
            id: 30
          },
          {
            title: '港台综艺',
            id: 31
          },
          {
            title: '欧美综艺',
            id: 32
          },
          {
            title: '日韩综艺',
            id: 33
          }
        ]
      },
      {
        title: '动漫',
        id: 4,
        children: [
          {
            title: '国产动漫',
            id: 34
          },
          {
            title: '日本动漫',
            id: 35
          },
          {
            title: '港台动漫',
            id: 36
          },
          {
            title: '欧美动漫',
            id: 37
          }
        ]
      },
      {
        title: '纪录',
        id: 22,
        children: []
      },
      {
        title: '游戏解说',
        id: 27,
        children: []
      },
      {
        title: '微电影',
        id: 29,
        children: []
      }
    ]
  },
  {
    key: 'wolongzy',
    name: '卧龙资源网',
    url: 'https://wolongzy.net',
    new: 'https://wolongzy.net/?page={page}',
    view: 'https://wolongzy.net/type/{id}.html?page={page}',
    search: 'https://wolongzy.net/search.html?searchword={keywords}',
    type: 1,
    tags: [
      {
        title: '最新',
        id: 0,
        children: []
      },
      {
        title: '电影',
        id: 1,
        children: [
          {
            title: '动作片',
            id: 5
          },
          {
            title: '喜剧片',
            id: 6
          },
          {
            title: '爱情片',
            id: 7
          },
          {
            title: '科幻片',
            id: 8
          },
          {
            title: '恐怖片',
            id: 9
          },
          {
            title: '剧情片',
            id: 10
          },
          {
            title: '战争片',
            id: 11
          },
          {
            title: '纪录片',
            id: 19
          },
          {
            title: '微电影',
            id: 20
          }
        ]
      },
      {
        title: '连续剧',
        id: 2,
        children: [
          {
            title: '国产剧',
            id: 12
          },
          {
            title: '香港剧',
            id: 13
          },
          {
            title: '韩国剧',
            id: 14
          },
          {
            title: '欧美剧',
            id: 15
          },
          {
            title: '台湾剧',
            id: 16
          },
          {
            title: '日本剧',
            id: 17
          },
          {
            title: '海外剧',
            id: 18
          }
        ]
      },
      {
        title: '综艺',
        id: 3,
        children: []
      },
      {
        title: '动漫',
        id: 4,
        children: []
      },
      {
        title: '伦理片',
        id: 21,
        children: []
      },
      {
        title: '福利',
        id: 22,
        children: []
      }
    ]
  },
  {
    key: 'gaoqingzy',
    name: '高清资源网',
    url: 'http://cj.gaoqingzyw.com',
    new: 'http://cj.gaoqingzyw.com/?m=vod-index-pg-{page}.html',
    view: 'http://cj.gaoqingzyw.com/?m=vod-type-id-{id}-pg-{page}.html',
    search: '',
    type: 2,
    tags: [
      {
        title: '最新',
        id: 0,
        children: []
      },
      {
        title: '电影',
        id: 21,
        children: [
          {
            title: '动作片',
            id: 5
          },
          {
            title: '喜剧片',
            id: 6
          },
          {
            title: '爱情片',
            id: 7
          },
          {
            title: '科幻片',
            id: 8
          },
          {
            title: '恐怖片',
            id: 9
          },
          {
            title: '剧情片',
            id: 10
          },
          {
            title: '战争片',
            id: 11
          },
          {
            title: '动画片',
            id: 16
          },
          {
            title: '奇幻片',
            id: 17
          },
          {
            title: '伦理片',
            id: 18
          }
        ]
      },
      {
        title: '连续剧',
        id: 19,
        children: [
          {
            title: '国产剧',
            id: 31
          },
          {
            title: '港剧',
            id: 22
          },
          {
            title: '台剧',
            id: 23
          },
          {
            title: '韩剧',
            id: 24
          },
          {
            title: '日剧',
            id: 25
          },
          {
            title: '欧美剧',
            id: 26
          },
          {
            title: '泰剧',
            id: 27
          }
        ]
      },
      {
        title: '综艺',
        id: 28,
        children: []
      },
      {
        title: '动漫',
        id: 16,
        children: []
      }
    ]
  }
]

const getSite = (e) => {
  for (const i of sites) {
    if (e === i.key) {
      return i
    }
  }
}

export {
  sites,
  getSite
}
