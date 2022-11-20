const { getProducts } = require('../models/product')
const { defaultRenderParameters } = require('../utils/response')

const listProductsView = async (req, res) => {
  log.info('GET /admin route requested')

  // load products to show
  // TODO: add pagination
  const products = await getProducts()

  const params = await defaultRenderParameters(req)
  params.title += ' - Products List'
  params.products = products

  res.render('products/list', params)
}

module.exports = {
  listProductsView,
}
