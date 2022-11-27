const {
  InvalidShippingError,
  InvalidCartError,
  CreditCardError,
} = require('../errors')
const { createOrder, getOrdersByUser } = require('../models/order')
const { getNewProducts } = require('../models/product')
const { getShippings } = require('../models/shipping')
const { validateCreditCard } = require('../utils/creditCard')
const {
  renderWithError,
  defaultRenderParameters,
} = require('../utils/response')

const createOrderView = async (req, res) => {
  await renderOrderPage(req, res, false)
}

const listUserOrdersView = async (req, res) => {
  const userId = req.user.id

  const orders = await getOrdersByUser(userId)

  const params = await defaultRenderParameters(req)
  params.title += ' - Pedidos'
  params.orders = orders

  res.render('orders/user-list', params)
}

const createUserOrder = async (req, res) => {
  log.info('POST /orders/user route requested')

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
      '/?resetCart=true&type=success&notification=Compra realizada com sucesso. Aguarde o email de confirmação.'
    )
  } catch (error) {
    log.error(error)

    if (error instanceof CreditCardError) {
      const notification = {
        message: 'Pagamento negado. Tente outro cartão de crédito.',
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
        'Página Inicial',
        'Erro no pagamento. Entre em contato com o suporte.',
        data
      )
    }
  }
}

const listOrdersView = async (req, res) => {
  log.info('GET /orders/user route requested')

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
        params.title += ' - Pedido'
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

      let message = 'Erro na página de pedidos. Entre em contato com o suporte.'

      if (error instanceof InvalidShippingError) {
        message = 'Forma de frete inválida.'
      } else if (error instanceof InvalidCartError) {
        message = 'Carrinho inválido.'
      }

      const products = await getNewProducts()
      const data = { products }

      await renderWithError(req, res, 'index', 'Página Inicial', message, data)
    }
  } else {
    res.redirect(
      '/login?type=error&notification=Você precisa ter feito o login para realizar a compra. Após isso acesse o carrinho novamente.'
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
