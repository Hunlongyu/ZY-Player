import db from './dexie'
const { search } = db
export default {
  async add (doc) {
    return await search.add(doc)
  },
  async find (doc) {
    return await search.get(doc)
  },
  async update (id, docs) {
    return await search.update(id, docs)
  },
  async all () {
    return await search.toArray()
  },
  async remove (id) {
    return await search.delete(id)
  },
  async clear () {
    return await search.clear()
  }
}
