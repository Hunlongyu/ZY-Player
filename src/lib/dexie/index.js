import Dexie from 'dexie'

const db = new Dexie('ZYDB')

db.version(1).stores({
  theme: '++id, theme',
  site: '++id, site',
  video: '++id, name, type, time, detail, urls, index'
})

db.version(2).stores({
  setting: 'id, theme, site, language, cloud, cloudKey',
  video: '++id, site, name, type, time, detail, index',
  history: '++id, site, name, type, time, detail, index, currentTime',
  mini: 'id, site, name, type, time, detail, index, currentTime'
})

const initData = [{
  id: 0,
  theme: 'light',
  site: 'zuidazy',
  language: 'zhCn',
  cloud: false,
  cloudKey: ''
}]

db.on('populate', () => {
  db.setting.bulkAdd(initData)
})

db.open()

export default db
