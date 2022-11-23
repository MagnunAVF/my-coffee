const express = require('express')

const {
  listShippingsView,
  createShippingView,
  createShippingRoute,
  deleteShippingMethod,
  shippingDetailstView,
  editShippingView,
  updateShippingMethod,
} = require('../controllers/shippingsController')
const { protectRoute } = require('../auth/protect')

const router = express.Router()

// Admin Shippings CRUD
router.get('/', protectRoute, listShippingsView)
router.get('/create', protectRoute, createShippingView)
router.post('/', protectRoute, createShippingRoute)
router.get('/:id/edit', protectRoute, editShippingView)
router.put('/:id', protectRoute, updateShippingMethod)
router.get('/:id', protectRoute, shippingDetailstView)
router.delete('/:id', protectRoute, deleteShippingMethod)

module.exports = router
