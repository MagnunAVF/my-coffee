const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const expressLayouts = require('express-ejs-layouts')
const prismaLib = require('@prisma/client')
const passport = require('passport')
const session = require('express-session')
const cookieParser = require('cookie-parser')

const { log } = require('./utils/log')
const { checkDbConnection } = require('./utils/db')

const app = express()

dotenv.config()

// set logger
global.log = log

// set db client
global.prisma = new prismaLib.PrismaClient()

const { loginCheck } = require('./auth/passport')
loginCheck(passport)

// env vars
const port = process.env.PORT || 3000
const env = process.env.ENV || 'dev'

// cookies
app.use(cookieParser())

// assets folder
app.use('/static', express.static(path.join(__dirname, 'public')))

// template engine and layouts
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(expressLayouts)
app.set('layout', './components/layout.ejs')

// Body Parsing
app.use(express.urlencoded({ extended: false }))
// Allow put forms
const methodOverride = require('method-override')
app.use(methodOverride('_method'))

// User Session
app.use(
  session({
    secret: 'oneboy',
    saveUninitialized: true,
    resave: true,
  })
)

app.use(passport.initialize())
app.use(passport.session())

// routes
app.use('/', require('./routes/index'))

// start server
app.listen(port, async () => {
  try {
    await checkDbConnection(prisma)

    // set inital app data
    global.posts = []
    global.allCategories = []

    log.info(`Running in ${env} mode in http://127.0.0.1:${port}`)
  } catch (error) {
    log.error(error)

    process.exit(1)
  }
})
