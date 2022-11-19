const express = require('express')

const {
  registerView,
  loginView,
  registerUser,
  loginUser,
  renderUserHome,
} = require('./controllers/usersController')
const { homeView } = require('./controllers/homeController')
const { adminDashboardView } = require('./controllers/adminController')
const { protectRoute } = require('./auth/protect')

const router = express.Router()

// Home
router.get('/', homeView)

// Users and Session
router.get('/register', registerView)
router.post('/register', registerUser)
router.get('/login', loginView)
router.post('/login', loginUser)
router.get('/user-home', renderUserHome)

// Admin Area
router.get('/admin', protectRoute, adminDashboardView)

module.exports = router
