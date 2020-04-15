import db from './index'
const { history } = db
export default {
  async add (doc) {
    return await history.add(doc)
  },
  async find (doc) {
    return await history.get(doc)
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
  async clear () {
    return await history.clear()
  }
}
