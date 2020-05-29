const os = require('os')
const macaddress = require('macaddress')
const AV = require('leancloud-storage')

macaddress.one((err, mac) => {
  if (err) {
    return false
  }
  AV.init({
    appId: 'X6TRIcMjgOG7EJ0t1l5r9In1-gzGzoHsz',
    appKey: 'JmkGF9UqkWGQNYDcJ2g1QV1b',
    serverURL: 'https://x6tricmj.lc-cn-n1-shared.com'
  })
  const system = os.hostname() + ' ' + os.type() + ' ' + os.arch()
  const query = new AV.Query('ZYPlayer')
  query.equalTo('os', system)
  query.equalTo('mac', mac)
  query.find().then(res => {
    // 存储新用户数据
    if (res.length === 0) {
      const ZYPlayer = AV.Object.extend('ZYPlayer')
      const zyPlayer = new ZYPlayer()
      zyPlayer.set('os', system)
      zyPlayer.set('mac', mac)
      zyPlayer.save()
      return false
    }
    // 统计启动次数
    if (res.length === 1) {
      const id = res[0].id
      const times = AV.Object.createWithoutData('ZYPlayer', id)
      times.increment('times', 1)
      times.save()
      return false
    }
    // 清除冗余数据
    if (res.length > 1) {
      const arr = res
      arr.shift()
      AV.Object.destroyAll(arr)
    }
  })
})
