const Product = prisma.product

const getProducts = async () => {
  const products = await Product.findMany()

  return products
}

module.exports = {
  Product,
  getProducts,
}
