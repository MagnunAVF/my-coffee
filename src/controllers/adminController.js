const { defaultRenderParameters } = require('../utils/response')

const adminDashboardView = (req, res) => {
  log.info('GET /admin route requested')

  const params = defaultRenderParameters()
  params.title += ' - Admin Dashboard'
  params.notification = {
    type: 'success',
    message: 'Welcome admin !',
  }

  res.render('adminDashboard', params)
}

module.exports = {
  adminDashboardView,
}
