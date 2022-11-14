const registerView = (req, res) => {
  res.render('register', { title: 'My Coffee - Register' })
}

const loginView = (req, res) => {
  res.render('login', { title: 'My Coffee - Login' })
}

module.exports = {
  registerView,
  loginView,
}
