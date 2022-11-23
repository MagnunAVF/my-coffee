const Shipping = prisma.shipping

const getShippings = async () => {
  const shippings = await Shipping.findMany()

  return shippings
}

const getShippingById = async (id) => {
  const shipping = await Shipping.findUnique({
    where: { id },
  })

  return shipping
}

const getShippingByName = async (name) => {
  const shipping = await Shipping.findUnique({ where: { name } })

  return shipping
}

const deleteShipping = async (id) => {
  await Shipping.delete({
    where: { id },
  })
}

const createShipping = async (attributes) => {
  const data = {
    ...attributes,
  }

  await Shipping.create({
    data,
  })
}

const updateShipping = async (id, data) => {
  await Shipping.update({
    where: { id },
    data,
  })
}

module.exports = {
  Shipping,
  getShippings,
  getShippingById,
  deleteShipping,
  createShipping,
  updateShipping,
  getShippingByName,
}
