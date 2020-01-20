import db from './index'

export default {
  add (data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      db.site.add(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  find (): Promise<any> {
    return new Promise((resolve, reject) => {
      db.site.get(1).then((res: any) => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  update (data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      db.site.update(1, data).then(updated => {
        if (updated) {
          resolve(updated)
        } else {
          reject(updated)
        }
      })
    })
  }
}
