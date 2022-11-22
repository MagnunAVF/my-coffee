const { CategoryWithProductsError } = require('../errors')

const Category = prisma.category

const getCategories = async () => {
  const categories = await Category.findMany()

  return categories
}

const getCategoryById = async (id) => {
  const category = await Category.findUnique({ where: { id } })

  return category
}

const getCategoryByName = async (name) => {
  const category = await Category.findUnique({ where: { name } })

  return category
}

const deleteCategory = async (id) => {
  // Check if category is connected to products
  const category = await Category.findUnique({
    where: { id },
    include: { products: { include: { product: true } } },
  })

  // TODO: fix ghost registers in many to many product-category
  const validProducts = category.products.filter((c) => c.productId !== null)

  if (validProducts.length > 0) {
    throw new CategoryWithProductsError(
      'Cannot delete a category with products!'
    )
  } else {
    await Category.delete({
      where: { id },
    })
  }
}

const createCategory = async (data) => {
  await Category.create({ data })
}

const updateCategory = async (id, data) => {
  await Category.update({
    where: { id },
    data,
  })
}

module.exports = {
  Category,
  getCategories,
  getCategoryById,
  getCategoryByName,
  deleteCategory,
  createCategory,
  updateCategory,
}
