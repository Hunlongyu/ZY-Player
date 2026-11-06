// 应用内置的远程配置地址与默认值

// 源站列表默认地址：原地址 raw.iqiq.io 已停止解析，改用 GitHub raw，jsDelivr 作为备用镜像
export const DEFAULT_SITES_DATA_URL = 'https://raw.githubusercontent.com/Hunlongyu/ZY-Player-Resources/main/Sites/20220713.json'

export const SITES_DATA_URL_MIRRORS = [
  DEFAULT_SITES_DATA_URL,
  'https://cdn.jsdelivr.net/gh/Hunlongyu/ZY-Player-Resources@main/Sites/20220713.json'
]

// 旧版本内置地址，仅用于识别并迁移
export const LEGACY_SITES_DATA_URL = 'https://raw.iqiq.io/Hunlongyu/ZY-Player-Resources/main/Sites/20220713.json'
export const LEGACY_DEFAULT_PARSE_URL = 'https://jx.bpba.cc/?v='

// 公开的解析服务均已陆续停服，不再内置固定地址；留空后由用户在设置中自行配置
export const DEFAULT_PARSE_URL = ''
