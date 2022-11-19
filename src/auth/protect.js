const protectRoute = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }

  const message = 'Login to continue'
  log.warn(message)

  res.render('login', {
    title: 'My Coffee - Login',
    notification: {
      type: 'error',
      message,
    },
  })
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
