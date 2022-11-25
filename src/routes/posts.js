const express = require('express')

const {
  listPostsView,
  createPostView,
  createPostRoute,
  deletePostMethod,
  postDetailstView,
  editPostView,
  updatePostMethod,
} = require('../controllers/postsController')
const { protectRoute } = require('../auth/protect')

const router = express.Router()

// Admin Posts CRUD
router.get('/', protectRoute, listPostsView)
router.get('/create', protectRoute, createPostView)
router.post('/', protectRoute, createPostRoute)
router.get('/:id/edit', protectRoute, editPostView)
router.put('/:id', protectRoute, updatePostMethod)
router.get('/:id', protectRoute, postDetailstView)
router.delete('/:id', protectRoute, deletePostMethod)

module.exports = router
