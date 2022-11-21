const Product = prisma.product

const getProducts = async () => {
  const products = await Product.findMany()

  return products
}

const deleteProduct = async (id) => {
  await Product.delete({
    where: { id },
  })
}

module.exports = {
  Product,
  getProducts,
  deleteProduct,
}
