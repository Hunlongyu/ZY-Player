import db from './dexie'
const { sites } = db
export default {
  async all () {
    return await sites.toArray()
  },
  async clear () {
    return await sites.clear()
  },
  async add (doc) {
    return await sites.bulkAdd(doc)
  }
}
