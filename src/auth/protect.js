const { renderWithError } = require('../utils/response')
const { matchRoute } = require('../utils/routes')

const ADMIN_ROUTES = [
  '/admin',
  '/products/*',
  '/posts/*',
  '/categories/*',
  '/shippings/',
  '/orders/*',
]
const CLIENT_ROUTES = ['/cart/*', '/address/*', '/orders/*']
// exception routes (not admin)
const PUBLIC_ROUTES = ['/products/showcase', '/orders/user', '/orders/create']

const protectRoute = async (req, res, next) => {
  const route = req.originalUrl
  const isAPublicRoute = matchRoute(route, PUBLIC_ROUTES)

  // Check if user is authenticated
  if (!req.isAuthenticated()) {
    if (isAPublicRoute) {
      return next()
    } else {
      await renderWithError(
        req,
        res,
        'users/login',
        'Login',
        'Entre para continuar'
      )
    }
  } else {
    // Check admin route
    const isAdminRoute = matchRoute(route, ADMIN_ROUTES)

    if (isAdminRoute) {
      const userType = req.user.type

      if (userType === 'admin') {
        const isAClientRoute = matchRoute(route, CLIENT_ROUTES)
        if (isAClientRoute) {
          res.redirect('/admin')
        } else {
          return next()
        }
      } else {
        // client user logged
        if (isAPublicRoute) {
          return next()
        } else {
          await renderWithError(req, res, 'users/login', 'Home', 'Invalid Page')
        }
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
