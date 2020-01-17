import Dexie from 'dexie'

class ZYDB extends Dexie {
  setting: Dexie.Table<setting, number>
  video: Dexie.Table<video, number>

  constructor () {
    super('ZYDB')
    this.version(1).stores({
      setting: '++id, theme, site',
      video: '++id, name, type, time, detail, urls, index'
    })

    this.setting = this.table('setting')
    this.video = this.table('video')
  }
}

export interface setting {
  id?: number
  theme?: string
  site?: object
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
