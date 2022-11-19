const bcrypt = require('bcryptjs')
const passport = require('passport')

const { User } = require('../models/user')

// Controller methods
const registerView = (req, res) => {
  log.info('GET /register route requested')

  res.render('register', { title: 'My Coffee - Register', notification: false })
}

const registerUser = (req, res) => {
  log.info('POST /register route requested')

  // validate attributes
  const { name, email, password, confirm } = req.body
  if (!name || !email || !password || !confirm) {
    renderRegisterWithError(res, 'Invalid atributes in user register.')
  }
  // validate password confirmation
  else if (password !== confirm) {
    renderRegisterWithError(res, 'Password and confirmation are not the same.')
  }
  // Create user
  else {
    User.findUnique({ where: { email } }).then((user) => {
      // Uniq email validation
      if (user) {
        renderRegisterWithError(res, 'Email already used.')
      } else {
        try {
          // Password Hashing
          bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err

            bcrypt.hash(password, salt, (err, hash) => {
              if (err) throw err

              let encryptedPassword = hash

              // Create new user with encrypted password
              User.create({
                data: {
                  name,
                  email,
                  password: encryptedPassword,
                  type: 'client',
                },
              }).then(
                res.render('login', {
                  title: 'My Coffee - Login',
                  notification: {
                    type: 'success',
                    message: 'User created! Now you can login.',
                  },
                })
              )
            })
          })
        } catch (err) {
          log.error(err)
          renderRegisterWithError(
            res,
            'Error in user register. Contact support.'
          )
        }
      }
    })
  }
}

const loginView = (req, res) => {
  log.info('GET /login route requested')

  res.render('login', { title: 'My Coffee - Login', notification: false })
}

const loginUser = (req, res) => {
  const { email, password } = req.body

  // Check required fields
  if (!email || !password) {
    const message = 'You must fill all fields'
    log.warn(message)

    res.render('login', {
      title: 'My Coffee - Login',
      notification: {
        type: 'error',
        message,
      },
    })
  } else {
    passport.authenticate('local', {
      successRedirect: '/user-home',
      failureRedirect: '/login',
      failureFlash: true,
    })(req, res)
  }
}

const renderUserHome = (req, res) => {
  const userType = req.user.type

  switch (userType) {
    case 'admin':
      res.redirect('/admin')
      break
    case 'client':
      res.redirect('/')
      break
    default:
      res.redirect('/server-error')
      break
  }
}

// Helper methods
const renderRegisterWithError = (res, message) => {
  log.warn(message)

  res.render('register', {
    title: 'My Coffee - Register',
    notification: { type: 'error', message },
  })
}

module.exports = {
  registerView,
  loginView,
  registerUser,
  loginUser,
  renderUserHome,
}
