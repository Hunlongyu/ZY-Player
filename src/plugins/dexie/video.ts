import db from './index'

export default {
  add (data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      db.video.add(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  find (data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      db.video.get(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  all (): Promise<any> {
    return new Promise((resolve, reject) => {
      db.video.toArray().then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  update (id: number, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      db.video.update(id, data).then(updated => {
        if (updated) {
          resolve(updated)
        } else {
          reject(updated)
        }
      })
    })
  },
  count (): Promise<any> {
    return new Promise((resolve, reject) => {
      db.video.count().then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  remove (id: number) {
    return new Promise((resolve, reject) => {
      db.video.delete(id).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  clear () {
    return new Promise((resolve, reject) => {
      db.video.clear().then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
}
