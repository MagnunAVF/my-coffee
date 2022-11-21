const { renderWithError } = require('../utils/response')
const { matchRoute } = require('../utils/routes')

const ADMIN_ROUTES = ['/admin', '/products/*']

const protectRoute = async (req, res, next) => {
  // Check if user is authenticated
  if (!req.isAuthenticated()) {
    await renderWithError(req, res, 'users/login', 'Login', 'Login to continue')
  } else {
    // Check admin route
    const route = req.originalUrl
    const isAdminRoute = matchRoute(route, ADMIN_ROUTES)

    if (isAdminRoute) {
      const userType = req.user.type

      if (userType === 'admin') {
        return next()
      } else {
        await renderWithError(req, res, 'index', 'Home', 'Invalid Page')
      }
    } else {
      return next()
    }
  }
}

const allowIf = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next()
  }

  res.redirect('/')
}

module.exports = {
  protectRoute,
  allowIf,
}
