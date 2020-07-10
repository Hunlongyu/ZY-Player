import db from './dexie'
const { setting } = db

export default {
  async find () {
    return await setting.get({ id: 0 })
  },
  async update (docs) {
    return await setting.update(0, docs)
  }
}
