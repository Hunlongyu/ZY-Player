import db from './dexie'
const { groups } = db
export default {
  async all () {
    return await groups.toArray()
  },
  async clear () {
    return await groups.clear()
  },
  async bulkAdd (doc) {
    return await groups.bulkAdd(doc)
  },
  async find (doc) {
    return await groups.get(doc)
  },
  async add (doc) {
    return await groups.add(doc)
  },
  async remove (id) {
    return await groups.delete(id)
  }
}
