import Dexie from 'dexie'
import { setting, sites, localKey } from './initData'

const db = new Dexie('zy')

db.version(3).stores({
  search: '++id, keywords',
  setting: 'id, theme, site, shortcut, view',
  shortcut: 'name, key, desc',
  star: '++id, site, ids, name, type, year, index',
  sites: '++id, key, name, json, xml, down, level',
  history: '++id, site, ids, name, type, year, index, time',
  mini: 'id, site, ids, name, index, time'
})

db.on('populate', () => {
  db.setting.bulkAdd(setting)
  db.sites.bulkAdd(sites)
  db.shortcut.bulkAdd(localKey)
})

db.open()

export default db
