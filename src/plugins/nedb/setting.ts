// import { setting } from './index'

// export default {
//   add (data: any): Promise<any> {
//     return new Promise((resolve, reject) => {
//       setting.insert(data, (err: any, doc: any) => {
//         reject(err)
//         resolve(doc)
//       })
//     })
//   },
//   find (data?: any): Promise<any> {
//     return new Promise((resolve, reject) => {
//       setting.find(data, (err: any, doc: any) => {
//         reject(err)
//         resolve(doc)
//       })
//     })
//   },
//   update (id: string, data: any): Promise<any> {
//     return new Promise((resolve, reject) => {
//       setting.update({ _id: id }, { $set: data }, {}, (err: any, num: number) => {
//         reject(err)
//         resolve(num)
//       })
//     })
//   }
// }
