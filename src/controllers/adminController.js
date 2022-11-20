const { defaultRenderParameters } = require('../utils/response')

const adminDashboardView = async (req, res) => {
  log.info('GET /admin route requested')

  const params = await defaultRenderParameters(req)
  params.title += ' - Admin Dashboard'
  params.notification = false

  res.render('adminDashboard', params)
}

module.exports = {
  adminDashboardView,
}
