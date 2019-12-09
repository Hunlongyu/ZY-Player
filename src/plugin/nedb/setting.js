import DB from './index'

const db = new DB()
const connect = db.init()
const setting = connect.setting

console.log(setting, 'setting')

export default {
  add (data) {
    return new Promise((resolve, reject) => {
      setting.insert(data, (err, docs) => {
        if (err) { reject(err) }
        resolve(docs)
      })
    })
  },
  find (data) {
    return new Promise((resolve, reject) => {
      setting.find(data, (err, docs) => {
        if (err) { reject(err) }
        resolve(docs)
      })
    })
  },
  update (id, data) {
    return new Promise((resolve, reject) => {
      setting.find({ _id: id }, { $set: data }, (err, docs) => {
        if (err) { reject(err) }
        resolve(docs)
      })
    })
  }
}
