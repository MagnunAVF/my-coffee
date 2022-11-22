const Category = prisma.category

const getCategories = async () => {
  const categories = await Category.findMany()

  return categories
}

const getCategoryById = async (id) => {
  const categories = await Category.findUnique({ where: { id } })

  return categories
}

const getCategoryByName = async (name) => {
  const categories = await Category.findUnique({ where: { name } })

  return categories
}

const deleteCategory = async (id) => {
  // TODO: check if category is connected to products
  await Category.delete({
    where: { id },
  })
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
