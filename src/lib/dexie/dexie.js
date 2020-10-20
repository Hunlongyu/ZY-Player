import Dexie from 'dexie'
import { setting, sites, groups, localKey, iptv, channelGroups } from './initData'

const db = new Dexie('zy')

db.version(3).stores({
  search: '++id, keywords',
  iptvSearch: '++id, keywords',
  setting: 'id, theme, site, shortcut, view, externalPlayer, searchAllSites, excludeRootClasses, excludeR18Films, forwardTimeInSec',
  shortcut: 'name, key, desc',
  star: '++id, site, ids, name, type, year, index',
  sites: '++id, key, name, json, xml, down, level',
  groups: '++gid, name, doubanRate',
  history: '++id, site, ids, name, type, year, index, time',
  mini: 'id, site, ids, name, index, time',
  iptv: '++id, name, url, gid',
  channelGroups: '++gid, name'
})

db.on('populate', () => {
  db.setting.bulkAdd(setting)
  db.sites.bulkAdd(sites)
  db.sites.bulkAdd(groups)
  db.shortcut.bulkAdd(localKey)
  db.iptv.bulkAdd(iptv)
  db.channelGroups.bulkAdd(channelGroups)
})

db.open()

export default db
