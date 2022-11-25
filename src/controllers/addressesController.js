const {
  getAddressesByUserId,
  updateAddress,
  createAddress,
} = require('../models/address')
const {
  defaultRenderParameters,
  renderWithError,
} = require('../utils/response')

const addressView = async (req, res) => {
  await renderAddressesList(req, res)
}

const createAddressRoute = async (req, res) => {
  log.info('POST /address route requested')

  // validate attributes
  const { zipCode, content } = req.body
  if (!zipCode || !content) {
    await renderWithError(
      req,
      res,
      'addresses/index',
      'Address Create',
      'Invalid attributes in address creation.'
    )
  }
  // Create Address
  else {
    const { user } = req
    // Uniq address validation
    const address = await getAddressesByUserId(user.id)
    if (address.length !== 0) {
      await renderWithError(
        req,
        res,
        'addresses/index',
        'Address Create',
        'Address already exists.'
      )
    } else {
      try {
        const attributes = {
          zipCode,
          content,
        }

        await createAddress(attributes, user)

        const notification = {
          type: 'success',
          message: 'Address created!',
        }

        await renderAddressesList(req, res, notification)
      } catch (err) {
        log.error(err)

        await renderWithError(
          req,
          res,
          'addresses/index',
          'Address Create',
          'Error in Address creation. Contact support.'
        )
      }
    }
  }
}

const updateAddressRoute = async (req, res) => {
  const { id } = req.params

  log.info(`PUT /address/${id} route requested`)

  const { user } = req

  // validate attributes
  const { zipCode, content } = req.body
  if (!zipCode || !content) {
    const notification = {
      message: 'Invalid attributes in address update.',
      type: 'error',
    }

    renderAddressesList(req, res, notification)
  }
  // Update Address
  else {
    // Address exists validation
    const address = await getAddressesByUserId(user.id)
    if (!address) {
      const notification = {
        type: 'error',
        message: 'Address not exists!',
      }

      renderAddressesList(req, res, notification)
    } else {
      try {
        await updateAddress(id, {
          zipCode,
          content,
        })

        const notification = {
          type: 'success',
          message: 'Address updated!',
        }

        renderAddressesList(req, res, notification)
      } catch (err) {
        log.error(err)

        const notification = {
          type: 'error',
          message: 'Error in Address creation. Contact support.',
        }

        renderAddressesList(req, res, notification)
      }
    }
  }
}

// helper
const renderAddressesList = async (req, res, notification) => {
  log.info('GET /address/ route requested')

  const { user } = req

  const addressesList = await getAddressesByUserId(user.id)

  const address = addressesList[0]

  const params = await defaultRenderParameters(req)
  params.title += ' - Address Details'
  params.address = address

  if (!params.notification) params.notification = notification

  res.render('addresses/index', params)
}

module.exports = {
  addressView,
  createAddressRoute,
  updateAddressRoute,
}
