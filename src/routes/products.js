const express = require('express')

const {
  listProductsView,
  createProductView,
} = require('../controllers/productsController')
const { protectRoute } = require('../auth/protect')

const router = express.Router()

// Admin Products CRUD
router.get('/', protectRoute, listProductsView)
router.get('/create', protectRoute, createProductView)

module.exports = router
