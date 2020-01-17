import Nedb from 'nedb'
export default class {
  db: any
  constructor () {
    this.db = null
  }

  create (db: any) {
    const name = process.env.NODE_ENV === 'development' ? 'ZY-dev' : 'ZY'
    const database: any = {}

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
