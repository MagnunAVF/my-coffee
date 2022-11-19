const express = require('express')
const {
  registerView,
  loginView,
  registerUser,
  loginUser,
} = require('./controllers/usersController')
const { homeView } = require('./controllers/homeController')
const { protectRoute } = require('./auth/protect')

const router = express.Router()

// Home
router.get('/', protectRoute, homeView)

// Users
router.get('/register', registerView)
router.post('/register', registerUser)
router.get('/login', loginView)
router.post('/login', loginUser)

module.exports = router
