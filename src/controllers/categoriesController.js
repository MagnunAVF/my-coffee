const {
  getCategories,
  deleteCategory,
  getCategoryByName,
  getCategoryById,
  updateCategory,
  createCategory,
} = require('../models/category')
const { defaultRenderParameters } = require('../utils/response')

const listCategoriesView = async (req, res) => {
  await renderCategoriesList(req, res, false)
}

const createCategoryRoute = async (req, res) => {
  log.info('POST /categories route requested')

  // validate attributes
  const { name } = req.body
  if (!name) {
    const notification = {
      type: 'error',
      message: 'Invalid attributes in category creation.',
    }

    await renderCategoriesList(req, res, notification)
  }
  // Create Category
  else {
    // Uniq category validation
    const category = await getCategoryByName(name)
    if (category) {
      const notification = {
        type: 'error',
        message: 'Category already exists.',
      }

      await renderCategoriesList(req, res, notification)
    } else {
      try {
        const data = {
          name,
        }

        await createCategory(data)

        const notification = {
          type: 'success',
          message: 'Category created!',
        }

        await renderCategoriesList(req, res, notification)
      } catch (err) {
        log.error(err)

        const notification = {
          type: 'error',
          message: 'Error in Category creation. Contact support.',
        }

        await renderCategoriesList(req, res, notification)
      }
    }
  }
}

const deleteCategoryMethod = async (req, res) => {
  const { id } = req.params

  log.info(`DELETE /categories/${id} route requested`)

  try {
    await deleteCategory(id)

    res.status(200).json({ message: 'Category deleted!' })
  } catch (error) {
    log.error(error)

    res
      .status(500)
      .json({ message: 'Error deleting category. Contact support.' })
  }
}

const updateCategoryMethod = async (req, res) => {
  const { id } = req.params

  log.info(`PUT /categories/${id} route requested`)

  // validate attributes
  const { name } = req.body
  if (!name) {
    const notification = {
      type: 'error',
      message: 'Invalid attributes in category update.',
    }

    await renderCategoriesList(req, res, notification)
  }
  // Update Category
  else {
    // Category exists validation
    const category = await getCategoryById(id)
    if (!category) {
      const notification = {
        type: 'error',
        message: 'Category not exists!',
      }

      await renderCategoriesList(req, res, notification)
    } else {
      try {
        await updateCategory(id, {
          name,
        })

        const notification = {
          type: 'success',
          message: 'Category updated!',
        }

        await renderCategoriesList(req, res, notification)
      } catch (err) {
        log.error(err)

        const notification = {
          type: 'error',
          message: 'Error in Category creation. Contact support.',
        }

        await renderCategoriesList(req, res, notification)
      }
    }
  }
}

// helper
const renderCategoriesList = async (req, res, notification) => {
  log.info('GET /categories route requested')

  // load categories to show
  // TODO: add pagination
  const categories = await getCategories()

  const params = await defaultRenderParameters(req)
  params.title += ' - Categories List'
  params.categories = categories

  if (!params.notification) params.notification = notification

  res.render('categories/index', params)
}

module.exports = {
  listCategoriesView,
  createCategoryRoute,
  deleteCategoryMethod,
  updateCategoryMethod,
}
