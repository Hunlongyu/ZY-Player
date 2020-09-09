import db from './dexie'
const { sites } = db
export default {
  async all () {
    return await sites.toArray()
  },
  async clear () {
    return await sites.clear()
  },
  async bulkAdd (doc) {
    return await sites.bulkAdd(doc)
  },
  async find (doc) {
    return await sites.get(doc)
  },
  async add (doc) {
    return await sites.add(doc)
  },
  async remove (id) {
    return await sites.delete(id)
  }
}
