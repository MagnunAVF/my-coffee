const {
  getProducts,
  deleteProduct,
  getProductByName,
  getProductById,
  updateProduct,
  createProduct,
  getFilteredProducts,
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
  params.title += ' - Criar Produto'
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
      'Criar Produto',
      'Atributos inválidos ao criar o produto.',
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
        'Criar Produto',
        'O produto já existe.',
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
          message: 'Produto Criado!',
        }

        await renderProductsList(req, res, notification)
      } catch (err) {
        log.error(err)

        await renderWithError(
          req,
          res,
          'products/create',
          'Criar Produto',
          'Erro ao criar o produto. Entre em contato com o suporte.',
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

    res.status(200).json({ message: 'Produto deletado!' })
  } catch (error) {
    log.error(error)

    res.status(500).json({
      message: 'Erro ao deletar o produto. Entre em contato com o suporte.',
    })
  }
}

const productDetailstView = async (req, res) => {
  const { id } = req.params

  log.info(`GET /products/${id} route requested`)

  const product = await getProductById(id)

  const params = await defaultRenderParameters(req)
  params.title += ' - Detalhes do Produto'
  params.product = product

  res.render('products/show', params)
}

const editProductView = async (req, res) => {
  const { id } = req.params

  log.info(`GET /products/${id}/edit route requested`)

  const product = await getProductById(id)

  const params = await defaultRenderParameters(req)
  params.title += ' - Editar Produto'
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
      message: 'Atributos inválidos ao atualizar o produto.',
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
        message: 'O produto não existe!',
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
          message: 'Produto atualizado!',
        }

        redirectWithNotification(res, `/products/${id}/edit`, notification)
      } catch (err) {
        log.error(err)

        const notification = {
          type: 'error',
          message:
            'Erro ao atualizar o produto. Entre em contato com o suporte.',
        }

        redirectWithNotification(res, `/products/${id}/edit`, notification)
      }
    }
  }
}

const getProductsShowcase = async (req, res) => {
  log.info('GET /products/showcase route requested')

  const products = await getProducts()

  await renderShowCase(req, res, products)
}

const getFilteredProductsShowcase = async (req, res) => {
  log.info('POST /products/showcase route requested')

  const { categories, orderBy } = req.body

  // format: Attribute-Sort
  const orderByElements = orderBy.split('-')
  const orderByAttribute = orderByElements[0]
  const orderBySort = orderByElements[1]

  const products = await getFilteredProducts(
    orderBySort,
    orderByAttribute,
    categories
  )

  await renderShowCase(req, res, products)
}

// helper
const renderProductsList = async (req, res, notification) => {
  log.info('GET /products route requested')

  // load products to show
  // TODO: add pagination
  const products = await getProducts()

  const params = await defaultRenderParameters(req)
  params.title += ' - Lista de Produtos'
  params.products = products

  if (!params.notification) params.notification = notification

  res.render('products/list', params)
}

const renderShowCase = async (req, res, products, notification) => {
  const params = await defaultRenderParameters(req)
  params.title += ' - Produtos'
  params.products = products
  params.categories = allCategories

  if (!params.notification) params.notification = notification

  res.render('products/showcase', params)
}

module.exports = {
  listProductsView,
  createProductView,
  createProductRoute,
  deleteProductMethod,
  productDetailstView,
  editProductView,
  updateProductMethod,
  getProductsShowcase,
  getFilteredProductsShowcase,
}
