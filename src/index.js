const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const expressLayouts = require('express-ejs-layouts')
const prismaLib = require('@prisma/client')

const { log } = require('./utils/log')
const { checkDbConnection } = require('./utils/db')

const app = express()
dotenv.config()

// env vars
const port = process.env.PORT || 3000
const env = process.env.ENV || 'dev'

// assets folder
app.use(express.static(__dirname + '/public'))

// set logger
global.log = log

// set db client
global.prisma = new prismaLib.PrismaClient()

// template engine and layouts
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(expressLayouts)
app.set('layout', './components/layout.ejs')

// Body Parsing
app.use(express.urlencoded({ extended: false }))

// routes
app.use('/', require('./routes'))

// start server
app.listen(port, () => {
  checkDbConnection(prisma).then((error) => {
    if (error) {
      process.exit(1)
    }

    log.info(`Running in ${env} mode in http://127.0.0.1:${port}`)
  })
})
