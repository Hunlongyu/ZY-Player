import db from './dexie'
const { star } = db
export default {
  async add (doc) {
    return await star.add(doc)
  },
  async bulkAdd (doc) {
    return await star.bulkAdd(doc)
  },
  async find (doc) {
    return await star.where(doc).first()
  },
  async update (id, docs) {
    return await star.update(id, docs)
  },
  async all () {
    return await star.toArray()
  },
  async remove (id) {
    return await star.delete(id)
  },
  async get (id) {
    return await star.get(id)
  },
  async clear () {
    return await star.clear()
  }
}
