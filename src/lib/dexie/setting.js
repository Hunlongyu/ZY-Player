import db from './index'
const { setting } = db
export default {
  async find () {
    return await setting.get({ id: 0 })
  },
  async update (docs) {
    return await setting.update(0, docs)
  }
}
/*
setting.find().then(res => {
  console.log(res, 'find')
})
setting.update({ theme: 'yellow' }).then(res => {
  console.log(res, 'update')
})
*/
