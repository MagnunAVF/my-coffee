const { CreditCardError } = require('../errors')

const VALID_CARD = {
  cardName: 'Neo',
  cardNumber: '4111111145551142',
  cardExpiration: '03/2030',
  cvv: '737',
}

const validateCreditCard = ({ cardName, cardNumber, cardExpiration, cvv }) => {
  const validName = cardName === VALID_CARD.cardName
  const validNumber = cardNumber === VALID_CARD.cardNumber
  const validExp = cardExpiration === VALID_CARD.cardExpiration
  const validCode = cvv === VALID_CARD.cvv

  if (!validName || !validNumber || !validExp || !validCode)
    throw new CreditCardError()
}

module.exports = {
  validateCreditCard,
}
