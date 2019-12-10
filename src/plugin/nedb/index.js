import Nedb from 'nedb'

export default class {
  constructor () {
    this.db = null
  }

  create (db) {
    const name = process.env.NODE_ENV === 'development' ? 'ZY-dev' : 'ZY'
    const database = {}

    database.setting = new Nedb({
      filename: name + db.setting,
      autoload: true
    })
    database.video = new Nedb({
      filename: name + db.video,
      autoload: true
    })

    return database
  }

  init () {
    if (this.db) {
      return this.db
    }

    this.db = this.create({
      setting: '-setting',
      video: '-video'
    })

    return this.db
  }
}
