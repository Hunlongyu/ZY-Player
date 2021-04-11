import db from './dexie'
const { setting } = db

export default {
  async find () {
    return await setting.get({ id: 0 })
  },
  async bulkAdd (doc) {
    return await setting.bulkAdd(doc)
  },
  async add (doc) {
    return await setting.add(doc)
  },
  async update (docs) {
    return await setting.update(0, docs)
  }
}
