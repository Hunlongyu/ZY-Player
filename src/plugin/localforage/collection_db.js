import lf from 'localforage'

const collection = lf.createInstance({
  name: 'ZY',
  storeName: 'collection',
  version: '1.0',
  description: 'ZY Player collection DB'
})

export default {
  set (key, value) {
    return new Promise((resolve, reject) => {
      collection.setItem(key, value).then(e => {
        resolve(e)
      }).catch(err => {
        reject(err)
      })
    })
  },
  remove (key) {
    return new Promise((resolve, reject) => {
      collection.removeItem(key).then(() => {
        resolve(true)
      }).catch(err => {
        reject(err)
      })
    })
  },
  clear () {
    return new Promise((resolve, reject) => {
      collection.clear().then(() => {
        resolve(true)
      }).catch(err => {
        reject(err)
      })
    })
  },
  find (key) {
    return new Promise((resolve, reject) => {
      collection.getItem(key).then(value => {
        resolve(value)
      }).catch(err => {
        reject(err)
      })
    })
  },
  all () {
    return new Promise((resolve, reject) => {
      collection.keys().then(value => {
        resolve(value)
      }).catch(err => {
        reject(err)
      })
    })
  },
  length () {
    return new Promise((resolve, reject) => {
      collection.length().then(value => {
        resolve(value)
      }).catch(err => {
        reject(err)
      })
    })
  }
}
