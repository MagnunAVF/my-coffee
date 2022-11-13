const express = require('express')
const dotenv = require('dotenv')

const { log } = require('./utils/log')

const app = express()
dotenv.config()

const port = process.env.PORT || 3000
const env = process.env.ENV || 'dev'

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  log.info(`Running in ${env} mode in http://127.0.0.1:${port}`)
})
