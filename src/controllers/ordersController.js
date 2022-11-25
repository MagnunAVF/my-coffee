const {
  InvalidShippingError,
  InvalidCartError,
  CreditCardError,
} = require('../errors')
const { createOrder } = require('../models/order')
const { getNewProducts } = require('../models/product')
const { getShippings } = require('../models/shipping')
const { validateCreditCard } = require('../utils/credit-card')
const {
  renderWithError,
  defaultRenderParameters,
} = require('../utils/response')

const createOrderView = async (req, res) => {
  await renderOrderPage(req, res, false)
}

const listUserOrdersView = async (req, res) => {
  log.info(req, res)
}

const createUserOrder = async (req, res) => {
  log.info('POST /orders/user route requested')
  // rember to clear cookies after order creation with success
  try {
    // unpack cart info
    // cart format: ID_product_1,quantity_product_2;ID_product_1,quantity_product_2;...
    const cartString = req.body.cart
    // new format: [ { id: '1', quantity: 2 }, ...]
    const products = cartString
      .split(';')
      .filter((e) => e !== '')
      .map((e) => {
        const prod = e.split(',')
        return { id: prod[0], quantity: parseInt(prod[1]) }
      })

    const { selectedShippingId, cardName, cardNumber, cardExpiration, cvv } =
      req.body
    const creditCardInfos = { cardName, cardNumber, cardExpiration, cvv }

    validateCreditCard(creditCardInfos)

    const userId = req.user.id
    await createOrder(userId, selectedShippingId, products)

    res.redirect(
      '/?type=success&notification=Purchase made successfully. Wait for the confirmation email.'
    )
  } catch (error) {
    log.error(error)

    if (error instanceof CreditCardError) {
      const notification = {
        message: 'Payment denied. Try another credit card.',
        type: 'error',
      }

      await renderOrderPage(req, res, notification, req.cookies)
    } else {
      const products = await getNewProducts()
      const data = { products }

      await renderWithError(
        req,
        res,
        'index',
        'Home',
        'Error in payment. Contact support.',
        data
      )
    }
  }
}

const listOrdersView = async (req, res) => {
  log.info(req, res)
}

const updateOrderStatus = async (req, res) => {
  log.info(req, res)
}

// helper
const renderOrderPage = async (req, res, notification, cookies) => {
  log.info('GET /orders/create route requested')

  const { user } = req

  if (user) {
    try {
      const shippings = await getShippings()

      const cookiesData = cookies ? cookies : req.cookies

      if (cookiesData.cart) {
        const cart = JSON.parse(cookiesData.cart)
        const shipping = cookiesData.shipping

        if (!shipping) throw new InvalidShippingError()

        const params = await defaultRenderParameters(req)
        params.title += ' - Order create'
        params.shippings = shippings
        params.selectedShippingId = shipping
        params.cart = cart

        if (!params.notification) params.notification = notification

        res.render('orders/create', params)
      } else {
        throw new InvalidCartError()
      }
    } catch (error) {
      log.error(error)

      let message = 'Error in order page. Contact support.'

      if (error instanceof InvalidShippingError) {
        message = 'Invalid shipping in order'
      } else if (error instanceof InvalidCartError) {
        message = 'Invalid cart in order'
      }

      const products = await getNewProducts()
      const data = { products }

      await renderWithError(req, res, 'index', 'Home', message, data)
    }
  } else {
    res.redirect(
      '/login?type=error&notification=You must login to go to payment. After this, go to cart again.'
    )
  }
}

module.exports = {
  createOrderView,
  listOrdersView,
  listUserOrdersView,
  createUserOrder,
  updateOrderStatus,
}
