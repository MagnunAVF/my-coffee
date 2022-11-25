const express = require('express')

const { protectRoute } = require('../auth/protect')
const {
  addressView,
  createAddressRoute,
  updateAddressRoute,
} = require('../controllers/addressesController')

const router = express.Router()

// Admin Address CRUD
router.get('/', protectRoute, addressView)
router.post('/', protectRoute, createAddressRoute)
router.put('/:id', protectRoute, updateAddressRoute)

module.exports = router
