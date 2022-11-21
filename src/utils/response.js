const { setGlobalPosts } = require('../models/post')
const { matchRoute } = require('./routes')

const TITLE_PREFIX = 'My Coffee'
const SHOW_POSTS_ROUTES = ['/']

const defaultRenderParameters = async (req) => {
  const route = req.originalUrl
  const showPosts = matchRoute(route, SHOW_POSTS_ROUTES)

  // TODO: improve posts render with pagination in component
  if (showPosts) {
    await setGlobalPosts()
  }

  const defaultParams = {
    title: TITLE_PREFIX,
    notification: false,
    user: false,
    showPosts,
    route,
    posts,
  }

  // check notifications in query string
  const { notification, type } = req.query
  if (notification && type) {
    defaultParams.notification = {
      message: notification,
      type,
    }
  }

  if (req.user) defaultParams.user = req.user
  defaultParams.user.password = null

  return defaultParams
}

const renderWithError = async (req, res, page, pageTitle, message) => {
  log.warn(message)

  const params = await defaultRenderParameters(req)
  params.title = `${TITLE_PREFIX} - ${pageTitle}`
  params.notification = { type: 'error', message }

  res.render(page, params)
}

module.exports = {
  defaultRenderParameters,
  renderWithError,
}
