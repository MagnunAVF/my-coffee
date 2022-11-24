const { renderWithError } = require('../utils/response')
const { matchRoute } = require('../utils/routes')

const ADMIN_ROUTES = [
  '/admin',
  '/products/*',
  '/posts/*',
  '/categories/*',
  '/shippings/',
]
// exception routes (not admin)
const PUBLIC_ROUTES = ['/products/showcase']

const protectRoute = async (req, res, next) => {
  const route = req.originalUrl

  // Check if user is authenticated
  if (!req.isAuthenticated()) {
    const isAPublicRoute = matchRoute(route, PUBLIC_ROUTES)

    if (isAPublicRoute) {
      return next()
    } else {
      await renderWithError(
        req,
        res,
        'users/login',
        'Login',
        'Login to continue'
      )
    }
  } else {
    // Check admin route
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
