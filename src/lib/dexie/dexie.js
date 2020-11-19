import Dexie from 'dexie'
import { setting, sites, localKey, iptv, recommendations } from './initData'

const db = new Dexie('zy')

db.version(4).stores({
  search: '++id, keywords',
  iptvSearch: '++id, keywords',
  setting: 'id, theme, site, shortcut, view, externalPlayer, searchGroup, excludeRootClasses, excludeR18Films, forwardTimeInSec, starViewMode, recommandationViewMode, searchViewMode, password, proxy',
  shortcut: 'name, key, desc',
  star: '++id, [key+ids], site, name, detail, index, rate, hasUpdate',
  recommendation: '++id, [key+ids], site, name, detail, index, rate, hasUpdate',
  sites: '++id, key, name, api, download, isActive, group',
  history: '++id, [site+ids], name, type, year, index, time, duration, detail',
  // mini: 'id, mode, site, ids, name, index, time, url',
  mini: 'id, bounds',
  iptv: '++id, name, url, channelID, isActive',
  channelList: '++id, name, prefer, channels, group, isActive'
})

db.on('populate', () => {
  db.setting.bulkAdd(setting)
  db.sites.bulkAdd(sites)
  db.shortcut.bulkAdd(localKey)
  db.iptv.bulkAdd(iptv)
  db.recommendation.bulkAdd(recommendations)
})

db.open()

export default db
