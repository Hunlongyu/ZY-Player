// import Nedb from 'nedb-async'
// import { Datastore } from 'nedb-async-await'

// @ts-ignore
import Nedb from 'nedb'

const setting = new Nedb({
  filename: 'setting',
  autoload: true
})

const video = new Nedb({
  filename: 'video',
  autoload: true
})

export {
  setting,
  video
}
