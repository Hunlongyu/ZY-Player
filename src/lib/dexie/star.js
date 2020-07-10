import db from './dexie'
const { star } = db
export default {
  async add (doc) {
    return await star.add(doc)
  },
  async find (doc) {
    return await star.get(doc)
  },
  async update (id, docs) {
    return await star.update(id, docs)
  },
  async all () {
    return await star.toArray()
  },
  async remove (id) {
    return await star.delete(id)
  }
}
