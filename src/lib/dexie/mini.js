import db from './dexie'
const { mini } = db
export default {
  async add (doc) {
    return await mini.add(doc)
  },
  async find () {
    return await mini.get({ id: 0 })
  },
  async update (docs) {
    return await mini.update(0, docs)
  }
}
