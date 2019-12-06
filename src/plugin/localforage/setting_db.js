import lf from 'localforage'

const setting = lf.createInstance({
  name: 'ZY',
  storeName: 'setting',
  version: '1.0',
  description: 'ZY Player setting DB'
})

export default {
  set (key, value) {
    return new Promise((resolve, reject) => {
      setting.setItem(key, value).then(e => {
        resolve(e)
      }).catch(err => {
        reject(err)
      })
    })
  },
  remove (key) {
    return new Promise((resolve, reject) => {
      setting.removeItem(key).then(() => {
        resolve(true)
      }).catch(err => {
        reject(err)
      })
    })
  },
  clear () {
    return new Promise((resolve, reject) => {
      setting.clear().then(() => {
        resolve(true)
      }).catch(err => {
        reject(err)
      })
    })
  },
  find (key) {
    return new Promise((resolve, reject) => {
      setting.getItem(key).then(value => {
        resolve(value)
      }).catch(err => {
        reject(err)
      })
    })
  }
}
