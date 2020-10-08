import db from './dexie'
const { iptvSearch } = db
export default {
  async add (doc) {
    return await iptvSearch.add(doc)
  },
  async find (doc) {
    return await iptvSearch.get(doc)
  },
  async update (id, docs) {
    return await iptvSearch.update(id, docs)
  },
  async all () {
    return await iptvSearch.toArray()
  },
  async remove (id) {
    return await iptvSearch.delete(id)
  },
  async clear () {
    return await iptvSearch.clear()
  }
}
