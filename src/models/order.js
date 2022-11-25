const { getProductByIdsList } = require('./product')
const { getShippingById } = require('./shipping')

const Order = prisma.order
const ProductQuantity = prisma.ProductQuantity

const getOrdersByUser = async (userId) => {
  const orders = await Order.findMany({
    where: {
      owner: {
        id: userId,
      },
    },
    include: {
      products: { include: { product: true } },
      shipping: true,
      owner: true,
      productQuantities: true,
    },
  })

  return orders
}

const getOrderById = async (id) => {
  const product = await Order.findUnique({
    where: { id },
    include: {
      products: { include: { product: true } },
      shipping: true,
      owner: true,
      productQuantities: true,
    },
  })

  return product
}

// products format: [ { id: '1', quantity: 2 }, ...]
const createOrder = async (userId, shippingId, products) => {
  // transform to categories connect format: [{ category: { connect: {id: 1 }}},...]
  const connectFormatProducts = products.reduce(
    (acc, val) => [...acc, { product: { connect: { id: val.id } } }],
    []
  )
  // calculate total
  let total = 0
  const shipping = await getShippingById(shippingId)
  total += shipping.price

  const productsList = await getProductByIdsList(products.map((e) => e.id))
  productsList.forEach((product) => {
    let productQuantity = products.filter((p) => p.id === product.id)[0]
      .quantity
    total += product.price * productQuantity
  })
  total = parseFloat(total.toFixed(2))

  const creadtedOrder = await Order.create({
    data: {
      shippingStatus: 'NOT SENDED',
      paymentStatus: 'PAID',
      total,
      shipping: {
        connect: {
          id: shippingId,
        },
      },
      owner: {
        connect: {
          id: userId,
        },
      },
      products: {
        create: connectFormatProducts,
      },
    },
    include: {
      products: true,
      shipping: true,
      owner: true,
    },
  })

  // link products quantities
  await Promise.all(
    products.map(async (product) => {
      await addQuantityToProduct(product.id, product.quantity, creadtedOrder.id)
    })
  )
}

const updateOrderShippingStatus = async (orderId, status) => {
  await Order.update({
    where: { id: orderId },
    data: { shippingStatus: status },
  })
}

const updateOrderPaymentStatus = async (orderId, status) => {
  await Order.update({
    where: { id: orderId },
    data: { paymentStatus: status },
  })
}

// helper methods
const addQuantityToProduct = async (productId, quantity, orderId) => {
  await ProductQuantity.create({
    data: {
      productId,
      quantity,
      order: {
        connect: {
          id: orderId,
        },
      },
    },
    include: {
      order: true,
    },
  })
}

module.exports = {
  createOrder,
  getOrdersByUser,
  getOrderById,
  updateOrderShippingStatus,
  updateOrderPaymentStatus,
}
