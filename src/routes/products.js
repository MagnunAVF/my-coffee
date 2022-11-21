const express = require('express')

const {
  listProductsView,
  createProductView,
  createProduct,
  deleteProductRoute,
} = require('../controllers/productsController')
const { protectRoute } = require('../auth/protect')

const router = express.Router()

// Admin Products CRUD
router.get('/', protectRoute, listProductsView)
router.get('/create', protectRoute, createProductView)
router.post('/', protectRoute, createProduct)
router.delete('/:id', protectRoute, deleteProductRoute)

module.exports = router
