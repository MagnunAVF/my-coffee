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
      'Endereço',
      'Atributos inválidos ao salvar o endereço.'
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
        'Endereço',
        'Já existe um endereço cadastrado.'
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
          message: 'Endereço Salvo!',
        }

        await renderAddressesList(req, res, notification)
      } catch (err) {
        log.error(err)

        await renderWithError(
          req,
          res,
          'addresses/index',
          'Endereço',
          'Erro ao salvar o endereço. Entre em contato com o suporte.'
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
      message: 'Atributos inválidos ao salvar o endereço.',
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
        message: 'Já existe um endereço cadastrado.',
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
          message: 'Endereço salvo!',
        }

        renderAddressesList(req, res, notification)
      } catch (err) {
        log.error(err)

        const notification = {
          type: 'error',
          message: 'Erro ao salvar o endereço. Entre em contato com o suporte.',
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
  params.title += ' - Endereço'
  params.address = address

  if (!params.notification) params.notification = notification

  res.render('addresses/index', params)
}

module.exports = {
  addressView,
  createAddressRoute,
  updateAddressRoute,
}
