const { renderWithError } = require('../utils/response')

const ADMIN_ROUTES = ['/admin']

const protectRoute = async (req, res, next) => {
  // Check if user is authenticated
  if (!req.isAuthenticated()) {
    await renderWithError(req, res, 'login', 'Login', 'Login to continue')
  } else {
    // Check admin route
    const route = req.route.path
    const isAdminRoute = ADMIN_ROUTES.includes(route)

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
