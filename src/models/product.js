const Product = prisma.product

const getProducts = async () => {
  const products = await Product.findMany()

  return products
}

const getProductById = async (id) => {
  const products = await Product.findUnique({ where: { id } })

  return products
}

const getProductByName = async (name) => {
  const products = await Product.findUnique({ where: { name } })

  return products
}

const deleteProduct = async (id) => {
  await Product.delete({
    where: { id },
  })
}

const updateProduct = async (id, data) => {
  await Product.update({
    where: { id },
    data,
  })
}

module.exports = {
  Product,
  getProducts,
  getProductById,
  getProductByName,
  deleteProduct,
  updateProduct,
}
