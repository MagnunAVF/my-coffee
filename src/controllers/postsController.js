const {
  getPosts,
  deletePost,
  getPostById,
  updatePost,
  getPostByTitle,
  createPost,
} = require('../models/post')
const {
  defaultRenderParameters,
  renderWithError,
  redirectWithNotification,
} = require('../utils/response')

const listPostsView = async (req, res) => {
  await renderPostsList(req, res, false)
}

const createPostView = async (req, res) => {
  log.info('GET /posts/create route requested')

  const params = await defaultRenderParameters(req)
  params.title += ' - Post Create'

  res.render('posts/create', params)
}

const createPostRoute = async (req, res) => {
  log.info('POST /posts route requested')

  // validate attributes
  const { title, content } = req.body
  if (!title || !content) {
    await renderWithError(
      req,
      res,
      'posts/create',
      'Post Create',
      'Invalid atributes in post creation.'
    )
  }
  // Create Post
  else {
    // Uniq post validation
    const post = await getPostByTitle(title)
    if (post) {
      await renderWithError(
        req,
        res,
        'posts/create',
        'Post Create',
        'Post already exists.'
      )
    } else {
      try {
        const attributes = {
          title,
          content,
        }
        const { user } = req

        await createPost(attributes, user)

        const notification = {
          type: 'success',
          message: 'Post created!',
        }

        await renderPostsList(req, res, notification)
      } catch (err) {
        log.error(err)

        await renderWithError(
          req,
          res,
          'posts/create',
          'Post Create',
          'Error in Post creation. Contact support.'
        )
      }
    }
  }
}

const deletePostMethod = async (req, res) => {
  const { id } = req.params

  log.info(`DELETE /posts/${id} route requested`)

  try {
    await deletePost(id)

    res.status(200).json({ message: 'Post deleted!' })
  } catch (error) {
    log.error(error)

    res.status(500).json({ message: 'Error deleting post. Contact support.' })
  }
}

const postDetailstView = async (req, res) => {
  const { id } = req.params

  log.info(`GET /posts/${id} route requested`)

  const post = await getPostById(id)

  const params = await defaultRenderParameters(req)
  params.title += ' - Post Details'
  params.post = post

  res.render('posts/show', params)
}

const editPostView = async (req, res) => {
  const { id } = req.params

  log.info(`GET /posts/${id}/edit route requested`)

  const post = await getPostById(id)

  const params = await defaultRenderParameters(req)
  params.title += ' - Post Edit'
  params.post = post

  res.render('posts/edit', params)
}

const updatePostMethod = async (req, res) => {
  const { id } = req.params

  log.info(`PUT /posts/${id} route requested`)

  // validate attributes
  const { title, content } = req.body
  if (!title || !content) {
    const notification = {
      message: 'Invalid atributes in post update.',
      type: 'error',
    }

    redirectWithNotification(res, `/posts/${id}/edit`, notification)
  }
  // Update Post
  else {
    // Post exists validation
    const post = await getPostById(id)
    if (!post) {
      const notification = {
        type: 'error',
        message: 'Post not exists!',
      }

      redirectWithNotification(res, '/posts', notification)
    } else {
      try {
        await updatePost(id, {
          title,
          content,
        })

        const notification = {
          type: 'success',
          message: 'Post updated!',
        }

        redirectWithNotification(res, '/posts', notification)
      } catch (err) {
        log.error(err)

        const notification = {
          type: 'error',
          message: 'Error in Post creation. Contact support.',
        }

        redirectWithNotification(res, `/posts/${id}/edit`, notification)
      }
    }
  }
}

// helper
const renderPostsList = async (req, res, notification) => {
  log.info('GET /posts route requested')

  // load posts to show
  // TODO: add pagination
  const posts = await getPosts()

  const params = await defaultRenderParameters(req)
  params.title += ' - Posts List'
  params.posts = posts

  if (!params.notification) params.notification = notification

  res.render('posts/list', params)
}

module.exports = {
  listPostsView,
  createPostView,
  createPostRoute,
  deletePostMethod,
  postDetailstView,
  editPostView,
  updatePostMethod,
}
