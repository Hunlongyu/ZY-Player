import db from './dexie'
const { recommandation } = db
export default {
  async add (doc) {
    return await recommandation.add(doc)
  },
  async bulkAdd (doc) {
    return await recommandation.bulkAdd(doc)
  },
  async find (doc) {
    return await recommandation.where(doc).first()
  },
  async update (id, docs) {
    return await recommandation.update(id, docs)
  },
  async all () {
    return await recommandation.toArray()
  },
  async remove (id) {
    return await recommandation.delete(id)
  },
  async get (id) {
    return await recommandation.get(id)
  },
  async clear () {
    return await recommandation.clear()
  }
}
