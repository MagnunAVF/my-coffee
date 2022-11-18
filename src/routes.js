const express = require('express')
const {
  registerView,
  loginView,
  registerUser,
} = require('./cotrollers/usersController')
const { homeView } = require('./cotrollers/homeController')

const router = express.Router()

// Home
router.get('/', homeView)

// Users
router.get('/register', registerView)
router.post('/register', registerUser)
router.get('/login', loginView)

module.exports = router
