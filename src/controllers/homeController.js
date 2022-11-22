const { defaultRenderParameters } = require('../utils/response')

const homeView = async (req, res) => {
  log.info('GET / route requested')

  const params = await defaultRenderParameters(req)
  params.title += ' - Home Page'

  res.render('index', params)
}

module.exports = {
  homeView,
}
