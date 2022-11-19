const bcrypt = require('bcryptjs')
const passport = require('passport')

const {
  defaultRenderParameters,
  renderWithError,
} = require('../utils/response')
const { User } = require('../models/user')

// Controller methods
const registerView = (req, res) => {
  log.info('GET /register route requested')

  const params = defaultRenderParameters(req)
  params.title += ' - Register'

  res.render('register', params)
}

const registerUser = (req, res) => {
  log.info('POST /register route requested')

  // validate attributes
  const { name, email, password, confirm } = req.body
  if (!name || !email || !password || !confirm) {
    renderWithError(
      req,
      res,
      'register',
      'Register',
      'Invalid atributes in user register.'
    )
  }
  // validate password confirmation
  else if (password !== confirm) {
    renderWithError(
      req,
      res,
      'register',
      'Register',
      'Password and confirmation are not the same.'
    )
  }
  // Create user
  else {
    User.findUnique({ where: { email } }).then((user) => {
      // Uniq email validation
      if (user) {
        renderWithError(req, res, 'register', 'Register', 'Email already used.')
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
              }).then(() => {
                const params = defaultRenderParameters(req)
                params.title += ' - Login'
                params.notification = {
                  type: 'success',
                  message: 'User created! Now you can login.',
                }

                res.render('login', params)
              })
            })
          })
        } catch (err) {
          log.error(err)

          renderWithError(
            req,
            res,
            'register',
            'Register',
            'Error in user register. Contact support.'
          )
        }
      }
    })
  }
}

const loginView = (req, res) => {
  log.info('GET /login route requested')

  const params = defaultRenderParameters(req)
  params.title += ' - Login'

  res.render('login', params)
}

const loginUser = (req, res) => {
  log.info('POST /register route requested')

  const { email, password } = req.body

  // Check required fields
  if (!email || !password) {
    renderWithError(req, res, 'login', 'Login', 'You must fill all fields')
  } else {
    // Authenticate User
    passport.authenticate('local', {
      successRedirect: '/user-home',
      failureRedirect: '/login',
      failureFlash: true,
    })(req, res)
  }
}

// Redirect User based on type
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

module.exports = {
  registerView,
  loginView,
  registerUser,
  loginUser,
  renderUserHome,
}
