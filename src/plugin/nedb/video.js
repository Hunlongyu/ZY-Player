// import DB from './index'
import DB from './index'

const db = new DB()
const connect = db.init()
const video = connect.video

export default {
  add (data) {
    return new Promise((resolve, reject) => {
      video.insert(data, (err, docs) => {
        if (err) { reject(err) }
        resolve(docs)
      })
    })
  },
  find (data) {
    return new Promise((resolve, reject) => {
      video.find(data, (err, docs) => {
        if (err) { reject(err) }
        resolve(docs)
      })
    })
  },
  update (id, data) {
    return new Promise((resolve, reject) => {
      video.find({ _id: id }, { $set: data }, (err, docs) => {
        if (err) { reject(err) }
        resolve(docs)
      })
    })
  },
  remove (id) {
    return new Promise((resolve, reject) => {
      video.remove({ _id: id }, {}, (err, docs) => {
        if (err) { reject(err) }
        resolve(docs)
      })
    })
  },
  removeAll () {
    return new Promise((resolve, reject) => {
      video.remove({}, { multi: true }, (err, docs) => {
        if (err) { reject(err) }
        resolve(docs)
      })
    })
  }
}
