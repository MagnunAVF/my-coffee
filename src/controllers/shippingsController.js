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
  params.title += ' - Shipping Create'

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
      'Shipping Create',
      'Invalid attributes in shipping creation.'
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
        'Shipping Create',
        'Shipping already exists.'
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
          message: 'Shipping created!',
        }

        await renderShippingsList(req, res, notification)
      } catch (err) {
        log.error(err)

        await renderWithError(
          req,
          res,
          'shippings/create',
          'Shipping Create',
          'Error in Shipping creation. Contact support.'
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

    res.status(200).json({ message: 'Shipping deleted!' })
  } catch (error) {
    log.error(error)

    res
      .status(500)
      .json({ message: 'Error deleting shipping. Contact support.' })
  }
}

const shippingDetailstView = async (req, res) => {
  const { id } = req.params

  log.info(`GET /shippings/${id} route requested`)

  const shipping = await getShippingById(id)

  const params = await defaultRenderParameters(req)
  params.title += ' - Shipping Details'
  params.shipping = shipping

  res.render('shippings/show', params)
}

const editShippingView = async (req, res) => {
  const { id } = req.params

  log.info(`GET /shippings/${id}/edit route requested`)

  const shipping = await getShippingById(id)

  const params = await defaultRenderParameters(req)
  params.title += ' - Shipping Edit'
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
      message: 'Invalid attributes in shipping update.',
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
        message: 'Shipping not exists!',
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
          message: 'Shipping updated!',
        }

        redirectWithNotification(res, '/shippings', notification)
      } catch (err) {
        log.error(err)

        const notification = {
          type: 'error',
          message: 'Error in Shipping creation. Contact support.',
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
  params.title += ' - Shippings List'
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
