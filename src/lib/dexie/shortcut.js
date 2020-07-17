import db from './dexie'
const { shortcut } = db

export default {
  async all () {
    return await shortcut.toArray()
  },
  async clear () {
    return await shortcut.clear()
  },
  async add (doc) {
    return await shortcut.bulkAdd(doc)
  }
}
