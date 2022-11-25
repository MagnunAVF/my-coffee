const express = require('express')

const {
  listCategoriesView,
  createCategoryRoute,
  deleteCategoryMethod,
  updateCategoryMethod,
} = require('../controllers/categoriesController')
const { protectRoute } = require('../auth/protect')

const router = express.Router()

// Admin Categories CRUD
router.get('/', protectRoute, listCategoriesView)
router.post('/', protectRoute, createCategoryRoute)
router.put('/:id', protectRoute, updateCategoryMethod)
router.delete('/:id', protectRoute, deleteCategoryMethod)

module.exports = router
