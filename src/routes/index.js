const express = require('express')

const {
  registerView,
  loginView,
  registerUser,
  loginUser,
  logoutUser,
  renderUserHome,
} = require('../controllers/usersController')
const { homeView } = require('../controllers/homeController')
const {
  adminDashboardView,
  generateSalesReport,
} = require('../controllers/adminController')
const { protectRoute } = require('../auth/protect')

const router = express.Router()

// Products Routes
router.use('/products', require('./products'))

// Categories Routes
router.use('/categories', require('./categories'))

// Posts Routes
router.use('/posts', require('./posts'))

// Shippings Routes
router.use('/shippings', require('./shippings'))

// Shopping Routes
router.use('/cart', require('./cart'))

// Addresses Routes
router.use('/address', require('./address'))

// Orders Routes
router.use('/orders', require('./orders'))

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
router.get('/sales-report', protectRoute, generateSalesReport)

module.exports = router
