import db from './dexie'
const { iptv } = db
export default {
  async all () {
    return await iptv.toArray()
  },
  async clear () {
    return await iptv.clear()
  },
  async add (doc) {
    return await iptv.add(doc)
  },
  async bulkAdd (doc) {
    return await iptv.bulkAdd(doc)
  },
  async find (doc) {
    return await iptv.get(doc)
  },
  async update (id, docs) {
    return await iptv.update(id, docs)
  },
  async remove (id) {
    return await iptv.delete(id)
  }
}
