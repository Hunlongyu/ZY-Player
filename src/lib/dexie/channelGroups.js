import db from './dexie'
const { channelGroups } = db
export default {
  async all () {
    return await channelGroups.toArray()
  },
  async clear () {
    return await channelGroups.clear()
  },
  async bulkAdd (doc) {
    return await channelGroups.bulkAdd(doc)
  },
  async find (doc) {
    return await channelGroups.get(doc)
  },
  async add (doc) {
    return await channelGroups.add(doc)
  },
  async remove (id) {
    return await channelGroups.delete(id)
  }
}
