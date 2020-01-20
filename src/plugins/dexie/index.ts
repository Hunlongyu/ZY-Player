import Dexie from 'dexie'

class ZYDB extends Dexie {
  theme: Dexie.Table<theme, number>
  site: Dexie.Table<site, number>
  video: Dexie.Table<video, number>

  constructor () {
    super('ZYDB')
    this.version(1).stores({
      theme: '++id, theme',
      site: '++id, site',
      video: '++id, name, type, time, detail, urls, index'
    })

    this.theme = this.table('theme')
    this.site = this.table('site')
    this.video = this.table('video')
  }
}

export interface theme {
  id: number
  theme?: string
}

export interface site {
  id: number
  site?: number
}

export interface video {
  id?: number
  name?: string
  type?: string
  time?: string
  detail?: string
  urls?: Array<string>
  index?: number
}

export default new ZYDB()
