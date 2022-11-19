const { defaultRenderParameters } = require('../utils/response')

const homeView = (req, res) => {
  log.info('GET / route requested')

  const params = defaultRenderParameters(req)
  params.title += ' - Home Page'

  res.render('index', params)
}

module.exports = {
  homeView,
}
