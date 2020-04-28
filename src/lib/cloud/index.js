import setting from '../dexie/setting'

const os = require('os')
const macadress = require('macaddress')
const AV = require('leancloud-storage')

setting.find().then(res => {
  const cloud = res.cloud
  if (!cloud) {
    macadress.one((err, mac) => {
      if (err) {
        return false
      }
      const system = os.hostname() + ' ' + os.type() + ' ' + os.arch()
      AV.init({
        appId: 'X6TRIcMjgOG7EJ0t1l5r9In1-gzGzoHsz',
        appKey: 'JmkGF9UqkWGQNYDcJ2g1QV1b',
        serverURL: 'https://x6tricmj.lc-cn-n1-shared.com'
      })
      const ZYPlayer = AV.Object.extend('ZYPlayer')
      const zyPlayer = new ZYPlayer()
      zyPlayer.set('os', system)
      zyPlayer.set('mac', mac)
      zyPlayer.save().then(e => {
        const id = e.id
        res.cloud = true
        res.cloudKey = id
        setting.update(res)
      })
    })
  }
})
