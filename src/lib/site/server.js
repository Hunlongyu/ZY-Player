import express from 'express'
import cors from 'cors'
const Axios = require('axios')
const net = require('net')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/api', async (req, res) => {
  const result = await Axios.get(req.body.url)
  res.json({
    code: 1,
    info: result.data
  })
})

function probe (port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer().listen(port)

    server.on('listening', () => {
      console.log('the server is runing on port ' + port)
      if (server) {
        server.close()
        resolve(port)
      }
    })

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(probe(port + 1))
      } else {
        reject(err)
      }
    })
  })
}
probe(44444).then(port => {
  app.listen(port, () => {
    console.log('start port' + port)
  })
})
