const TITLE_PREFIX = 'My Coffee'
const SHOW_POSTS_ROUTES = ['/']

const showPosts = (route) => {
  return SHOW_POSTS_ROUTES.includes(route)
}

const defaultRenderParameters = (req) => {
  const route = req.route.path

  const defaultParams = {
    title: TITLE_PREFIX,
    notification: false,
    user: false,
    showPosts: showPosts(route),
    route,
    posts,
  }

  if (req.user) defaultParams.user = req.user
  defaultParams.user.password = null

  return defaultParams
}

const renderWithError = (req, res, page, pageTitle, message) => {
  log.warn(message)

  const params = defaultRenderParameters(req)
  params.title = `${TITLE_PREFIX} - ${pageTitle}`
  params.notification = { type: 'error', message }

  res.render(page, params)
}

module.exports = {
  defaultRenderParameters,
  renderWithError,
}
