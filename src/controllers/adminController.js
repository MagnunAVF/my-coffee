const { defaultRenderParameters } = require('../utils/response')

const adminDashboardView = async (req, res) => {
  log.info('GET /admin route requested')

  const params = await defaultRenderParameters(req)
  params.title += ' - Painel Admin'

  res.render('adminDashboard', params)
}

module.exports = {
  adminDashboardView,
}
