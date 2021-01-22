import db from './dexie'
const { channelList } = db
export default {
  async all () {
    return await channelList.toArray()
  },
  async clear () {
    return await channelList.clear()
  },
  async add (doc) {
    return await channelList.add(doc)
  },
  async bulkAdd (doc) {
    return await channelList.bulkAdd(doc)
  },
  async find (doc) {
    return await channelList.get(doc)
  },
  async update (id, docs) {
    return await channelList.update(id, docs)
  },
  async remove (id) {
    return await channelList.delete(id)
  }
}
