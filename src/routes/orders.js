const express = require('express')

const { protectRoute } = require('../auth/protect')
const {
  listOrdersView,
  listUserOrdersView,
  createUserOrder,
  updateOrderStatus,
  createOrderView,
} = require('../controllers/ordersController')

const router = express.Router()

// Not admin routes
router.get('/create', protectRoute, createOrderView)
router.get('/user', protectRoute, listUserOrdersView)
router.post('/user', protectRoute, createUserOrder)

// Admin Orders CRUD
router.get('/', protectRoute, listOrdersView)
router.put('/:id', protectRoute, updateOrderStatus)

module.exports = router
