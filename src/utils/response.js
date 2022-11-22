const { setGlobalCategories } = require('../models/category')
const { setGlobalPosts } = require('../models/post')
const { matchRoute } = require('./routes')

const TITLE_PREFIX = 'My Coffee'
const SHOW_POSTS_ROUTES = ['/']
const SHOW_CATEGORIES_ROUTES = ['/products/*']

const defaultRenderParameters = async (req) => {
  const route = req.originalUrl
  const showPosts = matchRoute(route, SHOW_POSTS_ROUTES)
  const showCategories = matchRoute(route, SHOW_CATEGORIES_ROUTES)

  // TODO: improve posts render with pagination in component
  if (showPosts) {
    await setGlobalPosts()
  }

  if (showCategories) {
    await setGlobalCategories()
  }

  const defaultParams = {
    title: TITLE_PREFIX,
    notification: false,
    user: false,
    showPosts,
    route,
    posts,
    categories: allCategories,
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

const renderWithError = async (req, res, page, pageTitle, message, data) => {
  log.warn(message)

  let params = await defaultRenderParameters(req)
  params.title = `${TITLE_PREFIX} - ${pageTitle}`
  params.notification = { type: 'error', message }

  // optional arg
  if (data) {
    params = { ...params, ...data }
  }

  res.render(page, params)
}

const redirectWithNotification = (res, route, notification) => {
  const { message, type } = notification

  if (message && type) {
    res.redirect(`${route}?notification=${message}&type=${type}`)
  }
}

module.exports = {
  defaultRenderParameters,
  renderWithError,
  redirectWithNotification,
}
