import Dexie from 'dexie'
import { setting, sites, localKey, iptv, recommendations } from './initData'

const db = new Dexie('zy')

db.version(4).stores({
  search: '++id, keywords',
  setting: 'id, theme, site, shortcut, view, volume, externalPlayer, searchGroup, excludeRootClasses, excludeR18Films, forwardTimeInSec, starViewMode, recommandationViewMode, searchViewMode, password, proxy, allowPassWhenIptvCheck, autocleanWhenIptvCheck',
  shortcut: 'name, key, desc',
  star: '++id, [key+ids], site, name, detail, index, rate, hasUpdate',
  recommendation: '++id, [key+ids], site, name, detail, index, rate, hasUpdate',
  sites: '++id, key, name, api, download, isActive, group',
  history: '++id, [site+ids], name, type, year, index, time, duration, detail',
  mini: 'id, bounds',
  iptv: '++id, name, url, isActive',
  channelList: '++id, name, prefer, channels, group, isActive'
})

// 开发和稳定版同一版本号会有不同的数据库
// 参考https://github.com/dfahlander/Dexie.js/releases/tag/v3.0.0-alpha.3  upgrade可以改变主键和表名了
// https://dexie.org/docs/Version/Version.stores()
// https://dexie.org/docs/Version/Version.upgrade()
// https://ahuigo.github.io/b/ria/js-indexedDB#/  比较旧，适当参考
db.version(5).stores({
  shortcut: null
})

db.version(6).stores({
  shortcut: '++id, name, key, desc'
}).upgrade(async tx => {
  await tx.shortcut.bulkAdd(localKey)
})

db.version(7).stores({
  sites: '++id, key, name, api, download, jiexiUrl, isActive, group',
  history: '++id, [site+ids], name, type, year, index, time, duration, detail, onlinePlay'
}).upgrade(trans => {
  trans.sites.toCollection().modify(site => {
    site.jiexiUrl = ''
  })
  trans.history.toCollection().modify(record => {
    record.detail.fullList = [].concat(record.detail.m3u8List)
    delete record.detail.m3u8List
  })
  trans.star.toCollection().modify(favorite => {
    favorite.detail.fullList = [].concat(favorite.detail.m3u8List)
    delete favorite.detail.m3u8List
  })
})

db.version(8).stores({
}).upgrade(trans => {
  trans.sites.toCollection().modify(site => {
    if (site.api.includes('7kjx.com')) site.jiexiUrl = 'default'
  })
  trans.setting.toCollection().modify(setting => {
    setting.waitingTimeInSec = 15
    setting.autoChangeSourceWhenIptvStalling = true
  })
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
