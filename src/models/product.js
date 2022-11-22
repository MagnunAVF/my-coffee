const Product = prisma.product

const getProducts = async () => {
  const products = await Product.findMany({
    include: { categories: { include: { category: true } } },
  })

  return products
}

const getProductById = async (id) => {
  const product = await Product.findUnique({
    where: { id },
    include: { categories: { include: { category: true } } },
  })

  return product
}

const getProductByName = async (name) => {
  const product = await Product.findUnique({
    where: { name },
    include: { categories: { include: { category: true } } },
  })

  return product
}

const deleteProduct = async (id) => {
  await Product.delete({
    where: { id },
  })
}

const createProduct = async (attributes, categories) => {
  const createArgs = {
    data: {
      ...attributes,
    },
  }

  if (categories) {
    // transform to categories connect format: [{ category: { connect: {id: 1 }}},...]
    const connectFormatCategories = categories.reduce(
      (acc, val) => [...acc, { category: { connect: { id: val } } }],
      []
    )
    createArgs.data.categories = {
      create: connectFormatCategories,
    }

    createArgs.include = {
      categories: true,
    }
  }

  await Product.create(createArgs)
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
  createProduct,
  updateProduct,
}
