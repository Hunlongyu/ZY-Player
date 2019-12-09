import jetpack from 'fs-jetpack'
import fs from 'fs'
import Nedb from 'nedb'
import { remote } from 'electron'

export default class {
  constructor () {
    this.db = null
    this.dataDir = jetpack.cwd(remote.app.getPath('appData'))
  }

  createOrReadDB (db) {
    const dirName = process.env.NODE_ENV === 'development' ? '.ZY-dev' : '.ZY'
    const existsDir = jetpack.exists(this.dataDir.path(dirName))
    if (!existsDir) {
      fs.mkdir(this.dataDir.path(`${dirName}`), (err) => {
        if (err) console.log(err)
      })
    }

    const eSetting = fs.existsSync(this.dataDir.path(`${dirName}/${db.setting}`))
    const eVideo = fs.existsSync(this.dataDir.path(`${dirName}/${db.video}`))
    let database = {}

    if (!eSetting) {
      this.dataDir.write(this.dataDir.path(`${dirName}/${db.setting}`), '')
    }

    if (!eVideo) {
      this.dataDir.write(this.dataDir.path(`${dirName}/${db.video}`), '')
    }

    database.setting = new Nedb({
      filename: this.dataDir.path(`${dirName}/${db.setting}`),
      autoload: true
    })

    database.video = new Nedb({
      filename: this.dataDir.path(`${dirName}/${db.video}`),
      autoload: true
    })

    return database
  }

  init () {
    if (this.db) {
      return this.db
    }

    this.db = this.createOrReadDB({
      setting: 'setting.db',
      video: 'video.db'
    })

    return this.db
  }
}
