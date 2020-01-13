interface Site {
  id: string
  name: string
  url: string
  type: Array<any>
}

const sites:Array<Site> = [
  {
    id: 'okzy',
    name: 'OK资源网',
    url: 'https://www.okzy.co',
    type: [[ '最新', 0 ], [ '电影', 1 ], [ '电视剧', 2 ], [ '综艺', 3 ], [ '动漫', 4 ], [ '伦理', 21 ], [ '福利', 22 ], [ '解说', 33 ]]
  },
  {
    id: 'zuidazy',
    name: '最大资源网',
    url: 'http://www.zuidazy1.com',
    type: [[ '最新', 0 ], [ '电影', 1 ], [ '电视剧', 2 ], [ '综艺', 3 ], [ '动漫', 4 ], [ '福利', 16 ], [ '伦理', 17 ], [ '音乐', 18 ]]
  },
  {
    id: 'subo',
    name: '速播资源站',
    url: 'https://www.subo988.com',
    type: [[ '最新', 0 ], [ '电影', 1 ], [ '电视剧', 2 ], [ '综艺', 3 ], [ '动漫', 4 ], [ '伦理', 16 ], [ '音乐', 20 ]]
  },
  {
    id: 'zuixinzy',
    name: '最新资源网',
    url: 'http://www.zuixinzy.cc',
    type: [[ '最新', 0 ], [ '电影', 1 ], [ '电视剧', 2 ], [ '综艺', 3 ], [ '动漫', 4 ], ['伦理', 21], ['情色', 23], [ '福利', 30 ], [ '解说', 34 ]]
  },
  {
    id: '123ku',
    name: '123资源网',
    url: 'https://www.123ku.com',
    type: [[ '最新', 0 ], [ '电影', 1 ], [ '电视剧', 2 ], [ '综艺', 3 ], [ '动漫', 4 ], [ '伦理', 16 ]]
  }
]

export default sites
