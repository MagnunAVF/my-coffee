const { getShippings } = require('../models/shipping')
const {
  defaultRenderParameters,
  renderWithError,
} = require('../utils/response')

const cartView = async (req, res) => {
  log.info('GET /cart route requested')

  const shippings = await getShippings()
  let cart = null

  try {
    if (req.cookies.cart) {
      cart = JSON.parse(req.cookies.cart)
    }

    const params = await defaultRenderParameters(req)
    params.title += ' - Carrinho de Compras'
    params.shippings = shippings
    params.cart = cart

    res.render('cart/index', params)
  } catch (error) {
    log.error(error)

    const data = {
      shippings,
      cart,
    }
    renderWithError(
      req,
      res,
      'cart/index',
      ' - Carrinho de Compras',
      'Carrinho inválido. Criando um novo.',
      data
    )
  }
}

module.exports = {
  cartView,
}
