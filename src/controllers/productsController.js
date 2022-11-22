const {
  getProducts,
  deleteProduct,
  getProductByName,
  getProductById,
  updateProduct,
  createProduct,
} = require('../models/product')
const {
  defaultRenderParameters,
  renderWithError,
  redirectWithNotification,
} = require('../utils/response')

const listProductsView = async (req, res) => {
  await renderProductsList(req, res, false)
}

const createProductView = async (req, res) => {
  log.info('GET /products/create route requested')

  const params = await defaultRenderParameters(req)
  params.title += ' - Product Create'
  params.categories = allCategories

  res.render('products/create', params)
}

const createProductRoute = async (req, res) => {
  log.info('POST /products route requested')

  // validate attributes
  const { name, description, price, imageUrl, categories } = req.body
  if (!name || !description || !price || !imageUrl) {
    await renderWithError(
      req,
      res,
      'products/create',
      'Product Create',
      'Invalid attributes in product creation.',
      { categories: allCategories }
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
        'Product already exists.',
        { categories: allCategories }
      )
    } else {
      try {
        const data = {
          name,
          description,
          price: parseFloat(price),
          imageUrl,
        }

        await createProduct(data, categories)

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
          'Error in Product creation. Contact support.',
          { categories: allCategories }
        )
      }
    }
  }
}

const deleteProductMethod = async (req, res) => {
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
  params.title += ' - Product Details'
  params.product = product

  res.render('products/show', params)
}

const editProductView = async (req, res) => {
  const { id } = req.params

  log.info(`GET /products/${id}/edit route requested`)

  const product = await getProductById(id)

  const params = await defaultRenderParameters(req)
  params.title += ' - Product Edit'
  params.product = product
  params.categories = allCategories

  res.render('products/edit', params)
}

const updateProductMethod = async (req, res) => {
  const { id } = req.params

  log.info(`PUT /products/${id} route requested`)

  // validate attributes
  const { name, description, price, imageUrl, categories } = req.body
  if (!name || !description || !price || !imageUrl) {
    const notification = {
      message: 'Invalid attributes in product update.',
      type: 'error',
    }

    redirectWithNotification(res, `/products/${id}/edit`, notification)
  }
  // Update Product
  else {
    // Product exists validation
    const product = await getProductById(id)
    if (!product) {
      const notification = {
        type: 'error',
        message: 'Product not exists!',
      }

      redirectWithNotification(res, `/products/${id}/edit`, notification)
    } else {
      try {
        await updateProduct(
          id,
          {
            name,
            description,
            price: parseFloat(price),
            imageUrl,
          },
          categories
        )

        const notification = {
          type: 'success',
          message: 'Product updated!',
        }

        redirectWithNotification(res, `/products/${id}/edit`, notification)
      } catch (err) {
        log.error(err)

        const notification = {
          type: 'error',
          message: 'Error in Product creation. Contact support.',
        }

        redirectWithNotification(res, `/products/${id}/edit`, notification)
      }
    }
  }
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
  createProductRoute,
  deleteProductMethod,
  productDetailstView,
  editProductView,
  updateProductMethod,
}
