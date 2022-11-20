const { getProducts } = require('../models/product')
const { defaultRenderParameters } = require('../utils/response')

const listProductsView = async (req, res) => {
  log.info('GET /products route requested')

  // load products to show
  // TODO: add pagination
  const products = await getProducts()

  const params = await defaultRenderParameters(req)
  params.title += ' - Products List'
  params.products = products

  res.render('products/list', params)
}

const createProductView = async (req, res) => {
  log.info('GET /products/create route requested')

  const params = await defaultRenderParameters(req)
  params.title += ' - Product Create'

  res.render('products/create', params)
}

module.exports = {
  listProductsView,
  createProductView,
}
