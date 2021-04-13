const getSite = (key) => {
  for (const i of sites) {
    if (key === i.key) {
      return i
    }
  }
}

const sites = require('./iniData/Sites.json')
const iptv = require('./iniData/Iptv.json')
const recommendations = require('./iniData/Recommendations.json')
const iniSetting = require('./iniData/iniSetting.json')
const localKey = require('./iniData/localKey.json')
export {
  sites,
  iptv,
  recommendations,
  iniSetting,
  localKey,
  getSite
}
