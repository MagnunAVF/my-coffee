class CategoryWithProductsError extends Error {
  constructor(message) {
    super(message)
    this.name = 'CategoryWithProductsError'
  }
}

class InvalidShippingError extends Error {
  constructor(message) {
    super(message)
    this.name = 'InvalidShippingError'
  }
}

class InvalidCartError extends Error {
  constructor(message) {
    super(message)
    this.name = 'InvalidCartError'
  }
}

class CreditCardError extends Error {
  constructor(message) {
    super(message)
    this.name = 'CreditCardError'
  }
}

module.exports = {
  CategoryWithProductsError,
  InvalidShippingError,
  InvalidCartError,
  CreditCardError,
}
