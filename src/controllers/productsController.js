const { Product, getProducts } = require('../models/product')
const {
  defaultRenderParameters,
  renderWithError,
} = require('../utils/response')

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

const createProduct = async (req, res) => {
  log.info('POST /products/create route requested')

  // validate attributes
  const { name, description, price, imageUrl } = req.body
  if (!name || !description || !price || !imageUrl) {
    await renderWithError(
      req,
      res,
      'products/create',
      'Product Create',
      'Invalid atributes in product creation.'
    )
  }
  // Create Product
  else {
    // Uniq product validation
    const product = await Product.findUnique({ where: { name } })
    if (product) {
      await renderWithError(
        req,
        res,
        'products/create',
        'Product Create',
        'Product already exists.'
      )
    } else {
      try {
        await Product.create({
          data: {
            name,
            description,
            price: parseFloat(price),
            imageUrl,
          },
        })

        // get products to render
        const products = await getProducts()

        const params = await defaultRenderParameters(req)
        params.title += ' - Products List'
        params.notification = {
          type: 'success',
          message: 'Product created!',
        }
        params.products = products

        res.render('products/list', params)
      } catch (err) {
        log.error(err)

        await renderWithError(
          req,
          res,
          'products/create',
          'Product Create',
          'Error in Product creation. Contact support.'
        )
      }
    }
  }
}

module.exports = {
  listProductsView,
  createProductView,
  createProduct,
}
