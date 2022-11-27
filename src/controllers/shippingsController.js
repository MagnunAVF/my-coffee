const {
  getShippings,
  deleteShipping,
  getShippingById,
  updateShipping,
  getShippingByName,
  createShipping,
} = require('../models/shipping')
const {
  defaultRenderParameters,
  renderWithError,
  redirectWithNotification,
} = require('../utils/response')

const listShippingsView = async (req, res) => {
  await renderShippingsList(req, res, false)
}

const createShippingView = async (req, res) => {
  log.info('GET /shippings/create route requested')

  const params = await defaultRenderParameters(req)
  params.title += ' - Criar Forma de Frete'

  res.render('shippings/create', params)
}

const createShippingRoute = async (req, res) => {
  log.info('POST /shippings route requested')

  // validate attributes
  const { name, description, price } = req.body
  if (!name || !description || !price) {
    await renderWithError(
      req,
      res,
      'shippings/create',
      'Criar Forma de Frete',
      'Atributos inválidos ao criar a forma de frete.'
    )
  }
  // Create Shipping
  else {
    // Uniq shipping validation
    const shipping = await getShippingByName(name)
    if (shipping) {
      await renderWithError(
        req,
        res,
        'shippings/create',
        'Criar Forma de Frete',
        'A forma de frete já existe.'
      )
    } else {
      try {
        const attributes = {
          name,
          description,
          price: parseFloat(price),
        }

        await createShipping(attributes)

        const notification = {
          type: 'success',
          message: 'Criar Forma de Freted!',
        }

        await renderShippingsList(req, res, notification)
      } catch (err) {
        log.error(err)

        await renderWithError(
          req,
          res,
          'shippings/create',
          'Criar Forma de Frete',
          'Erro ao criar a forma de frete. Entre em contato com o suporte.'
        )
      }
    }
  }
}

const deleteShippingMethod = async (req, res) => {
  const { id } = req.params

  log.info(`DELETE /shippings/${id} route requested`)

  try {
    await deleteShipping(id)

    res.status(200).json({ message: 'Forma de frete deletada!' })
  } catch (error) {
    log.error(error)

    res.status(500).json({
      message:
        'Erro ao deletar a forma de frete. Entre em contato com o suporte.',
    })
  }
}

const shippingDetailstView = async (req, res) => {
  const { id } = req.params

  log.info(`GET /shippings/${id} route requested`)

  const shipping = await getShippingById(id)

  const params = await defaultRenderParameters(req)
  params.title += ' - Detalhes da Forma de Frete'
  params.shipping = shipping

  res.render('shippings/show', params)
}

const editShippingView = async (req, res) => {
  const { id } = req.params

  log.info(`GET /shippings/${id}/edit route requested`)

  const shipping = await getShippingById(id)

  const params = await defaultRenderParameters(req)
  params.title += ' - Editar Forma de Frete'
  params.shipping = shipping

  res.render('shippings/edit', params)
}

const updateShippingMethod = async (req, res) => {
  const { id } = req.params

  log.info(`PUT /shippings/${id} route requested`)

  // validate attributes
  const { name, description, price } = req.body
  if (!name || !description || !price) {
    const notification = {
      message: 'Atributos inválidos ao atualizar a forma de frete.',
      type: 'error',
    }

    redirectWithNotification(res, `/shippings/${id}/edit`, notification)
  }
  // Update Shipping
  else {
    // Shipping exists validation
    const shipping = await getShippingById(id)
    if (!shipping) {
      const notification = {
        type: 'error',
        message: 'A forma de frete já existe!',
      }

      redirectWithNotification(res, '/shippings', notification)
    } else {
      try {
        await updateShipping(id, {
          name,
          description,
          price: parseFloat(price),
        })

        const notification = {
          type: 'success',
          message: 'Forma de frete atualizada!',
        }

        redirectWithNotification(res, '/shippings', notification)
      } catch (err) {
        log.error(err)

        const notification = {
          type: 'error',
          message:
            'Erro ao criar a forma de frete. Entre em contato com o suporte.',
        }

        redirectWithNotification(res, `/shippings/${id}/edit`, notification)
      }
    }
  }
}

// helper
const renderShippingsList = async (req, res, notification) => {
  log.info('GET /shippings route requested')

  // load shippings to show
  // TODO: add pagination
  const shippings = await getShippings()

  const params = await defaultRenderParameters(req)
  params.title += ' - Listar Formas de Frete'
  params.shippings = shippings

  if (!params.notification) params.notification = notification

  res.render('shippings/list', params)
}

module.exports = {
  listShippingsView,
  createShippingView,
  createShippingRoute,
  deleteShippingMethod,
  shippingDetailstView,
  editShippingView,
  updateShippingMethod,
}
