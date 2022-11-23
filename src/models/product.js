const { getCategoriesByProductId } = require('./category')

const Product = prisma.product
const ProductCategoriesConnection = prisma.ProductCategories

const getProducts = async () => {
  const products = await Product.findMany({
    include: { categories: { include: { category: true } } },
  })

  return products
}

const getNewProducts = async () => {
  const products = await Product.findMany({
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
    include: { categories: { include: { category: true } } },
    take: 3,
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

const updateProduct = async (id, attributes, categories) => {
  let newCategories
  if (categories) {
    typeof categories === 'string'
      ? (newCategories = [categories])
      : (newCategories = categories)
  } else {
    newCategories = []
  }

  const savedProductCategories = await getCategoriesByProductId(id)
  const savedProductCategoriesIds = savedProductCategories.reduce(
    (acc, val) => [...acc, val.id],
    []
  )

  // saved data + new data with uniq values
  const allData = [...new Set([...newCategories, ...savedProductCategoriesIds])]

  const categoriesToAdd = newCategories.filter(
    (c) => !savedProductCategoriesIds.includes(c)
  )
  const categoriesToRemove = savedProductCategoriesIds.filter(
    (c) => !newCategories.includes(c)
  )

  const updateArgs = {
    where: { id },
    data: {
      ...attributes,
    },
  }

  // transform to categories connect format: [{ category: { connect: {id: 1 }}},...]
  const connectCategory = (id) => {
    return { category: { connect: { id } } }
  }

  const checkIfAdd = (id) => {
    let result = null
    if (categoriesToAdd.includes(id)) {
      result = connectCategory(id)
    }

    return result
  }
  let linkFormatCategories = allData.reduce(
    (acc, val) => [...acc, checkIfAdd(val)],
    []
  )
  // remove null registers (category stay connected to product)
  linkFormatCategories = linkFormatCategories.filter((e) => e)

  // change product-category connections (connect or disconnect) if needed
  if (linkFormatCategories.length > 0) {
    updateArgs.data.categories = {
      create: linkFormatCategories,
    }

    updateArgs.include = {
      categories: true,
    }
  }

  // TODO: improve add and remove categories (one db call only)
  // Update product and add categories if needed
  await Product.update(updateArgs)

  // remove categories if needed
  if (categoriesToRemove.length > 0) {
    await Promise.all(
      categoriesToRemove.map(async (categoryId) => {
        await removeCategoryFromProduct(categoryId, id)
      })
    )
  }
}

// helper methods
const removeCategoryFromProduct = async (categoryId, productId) => {
  // use delete many to be able to delete with multiple conditions
  await ProductCategoriesConnection.deleteMany({
    where: { categoryId, productId },
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
  getNewProducts,
}
