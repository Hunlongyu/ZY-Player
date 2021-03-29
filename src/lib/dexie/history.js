import db from './dexie'
const { history } = db
export default {
  async add (doc) {
    return await history.add(doc)
  },
  async bulkAdd (doc) {
    return await history.bulkAdd(doc)
  },
  async find (doc) {
    return await history.where(doc).first()
  },
  async update (id, docs) {
    return await history.update(id, docs)
  },
  async all () {
    return await history.toArray()
  },
  async remove (id) {
    return await history.delete(id)
  },
  async get (id) {
    return await history.get(id)
  },
  async clear () {
    return await history.clear()
  }
}
