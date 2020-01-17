import db from './index'

export default {
  add (data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      db.setting.add(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  find (data?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      db.setting.get(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  update (id: number, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      db.setting.update(id, data).then(updated => {
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
      db.setting.count().then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
}
