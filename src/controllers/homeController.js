const { getNewProducts } = require('../models/product')
const { defaultRenderParameters } = require('../utils/response')

const homeView = async (req, res) => {
  log.info('GET / route requested')

  const products = await getNewProducts()

  const params = await defaultRenderParameters(req)
  params.title += ' - Página Inicial'
  params.products = products

  res.render('index', params)
}

module.exports = {
  homeView,
}
