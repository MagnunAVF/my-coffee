const {
  Product,
  getProducts,
  deleteProduct,
  getProductByName,
  getProductById,
} = require('../models/product')
const {
  defaultRenderParameters,
  renderWithError,
} = require('../utils/response')

const listProductsView = async (req, res) => {
  await renderProductsList(req, res, false)
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
    const product = await getProductByName(name)
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

        const notification = {
          type: 'success',
          message: 'Product created!',
        }

        await renderProductsList(req, res, notification)
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

const deleteProductRoute = async (req, res) => {
  const { id } = req.params

  log.info(`DELETE /products/${id} route requested`)

  try {
    await deleteProduct(id)

    res.status(200).json({ message: 'Product deleted!' })
  } catch (error) {
    log.error(error)

    res
      .status(500)
      .json({ message: 'Error deleting product. Contact support.' })
  }
}

const productDetailstView = async (req, res) => {
  const { id } = req.params

  log.info(`GET /products/${id} route requested`)

  const product = await getProductById(id)

  const params = await defaultRenderParameters(req)
  params.title += ' - Product Create'
  params.product = product

  res.render('products/show', params)
}

// helper
const renderProductsList = async (req, res, notification) => {
  log.info('GET /products route requested')

  // load products to show
  // TODO: add pagination
  const products = await getProducts()

  const params = await defaultRenderParameters(req)
  params.title += ' - Products List'
  params.products = products

  if (!params.notification) params.notification = notification

  res.render('products/list', params)
}

module.exports = {
  listProductsView,
  createProductView,
  createProduct,
  deleteProductRoute,
  productDetailstView,
}
