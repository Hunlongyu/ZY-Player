import db from './dexie'
const { recommendation } = db
export default {
  async add (doc) {
    return await recommendation.add(doc)
  },
  async bulkAdd (doc) {
    return await recommendation.bulkAdd(doc)
  },
  async find (doc) {
    return await recommendation.where(doc).first()
  },
  async update (id, docs) {
    return await recommendation.update(id, docs)
  },
  async all () {
    return await recommendation.toArray()
  },
  async remove (id) {
    return await recommendation.delete(id)
  },
  async get (id) {
    return await recommendation.get(id)
  },
  async clear () {
    return await recommendation.clear()
  }
}
