const express = require('express')

const {
  registerView,
  loginView,
  registerUser,
  loginUser,
  logoutUser,
  renderUserHome,
} = require('./controllers/usersController')
const { listProductsView } = require('./controllers/productsController')
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
router.get('/logout', logoutUser)

// Admin Area
router.get('/admin', protectRoute, adminDashboardView)

// Admin Products CRUD
router.get('/products', protectRoute, listProductsView)

module.exports = router
