import db from './index'
const { video } = db
export default {
  async add (doc) {
    return await video.add(doc)
  },
  async find (doc) {
    return await video.get(doc)
  },
  async update (id, docs) {
    return await video.update(id, docs)
  },
  async all () {
    return await video.toArray()
  },
  async remove (id) {
    return await video.delete(id)
  }
}
