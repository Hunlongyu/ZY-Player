import db from './dexie'
const { cachedMovies } = db
export default {
  async add (doc) {
    return await cachedMovies.add(doc)
  },
  async bulkAdd (doc) {
    return await cachedMovies.bulkAdd(doc)
  },
  async find (doc) {
    return await cachedMovies.where(doc).first()
  },
  async update (id, docs) {
    return await cachedMovies.update(id, docs)
  },
  async all () {
    return await cachedMovies.toArray()
  },
  async remove (id) {
    return await cachedMovies.delete(id)
  },
  async get (id) {
    return await cachedMovies.get(id)
  },
  async clear () {
    return await cachedMovies.clear()
  }
}
