import fly from 'flyio'
import sites from './sites'

interface ZY {
  num: number
  page: number
  key: string
  site: object
  list: Array<string>
  getInfoRequire: any
  getInfoHtml: any
  info: any
  getDetailUrls: any
  detail: any
  getFilmsRequire: any
  films: any
}
const zy:ZY = {
  num: 0,
  page: 1,
  key: '',
  site: {},
  list: [],
  getInfoRequire () {},
  getInfoHtml () {},
  info () {},
  getDetailUrls () {},
  detail () {},
  getFilmsRequire () {},
  films () {}
}

export default zy
