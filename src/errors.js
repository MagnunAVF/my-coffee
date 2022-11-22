class CategoryWithProductsError extends Error {
  constructor(message) {
    super(message)
    this.name = 'CategoryWithProductsError'
  }
}

module.exports = {
  CategoryWithProductsError,
}
