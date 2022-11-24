const express = require('express')

const {
  listProductsView,
  createProductView,
  createProductRoute,
  deleteProductMethod,
  productDetailstView,
  editProductView,
  updateProductMethod,
  getProductsShowcase,
  getFilteredProductsShowcase,
} = require('../controllers/productsController')
const { protectRoute } = require('../auth/protect')

const router = express.Router()

// Public routes
router.get('/showcase', getProductsShowcase)
router.post('/showcase', getFilteredProductsShowcase)

// Admin Products CRUD
router.get('/', protectRoute, listProductsView)
router.get('/create', protectRoute, createProductView)
router.post('/', protectRoute, createProductRoute)
router.get('/:id/edit', protectRoute, editProductView)
router.put('/:id', protectRoute, updateProductMethod)
router.get('/:id', protectRoute, productDetailstView)
router.delete('/:id', protectRoute, deleteProductMethod)

module.exports = router
