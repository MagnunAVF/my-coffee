const bcrypt = require('bcryptjs')
const passport = require('passport')

const {
  defaultRenderParameters,
  renderWithError,
} = require('../utils/response')
const { User } = require('../models/user')

// Controller methods
const registerView = async (req, res) => {
  log.info('GET /register route requested')

  const params = await defaultRenderParameters(req)
  params.title += ' - Register'

  res.render('users/register', params)
}

const registerUser = async (req, res) => {
  log.info('POST /register route requested')

  // validate attributes
  const { name, email, password, confirm } = req.body
  if (!name || !email || !password || !confirm) {
    await renderWithError(
      req,
      res,
      'users/register',
      'Register',
      'Invalid attributes in user register.'
    )
  }
  // validate password confirmation
  else if (password !== confirm) {
    await renderWithError(
      req,
      res,
      'users/register',
      'Register',
      'Password and confirmation are not the same.'
    )
  }
  // Create user
  else {
    // Uniq email validation
    const user = await User.findUnique({ where: { email } })
    if (user) {
      await renderWithError(
        req,
        res,
        'users/register',
        'Register',
        'Email already used.'
      )
    } else {
      try {
        // Password Hashing
        const salt = await bcrypt.genSalt(10)
        const encryptedPassword = await bcrypt.hash(password, salt)

        // Create User
        await User.create({
          data: {
            name,
            email,
            type: 'client',
            password: encryptedPassword,
          },
        })

        const params = await defaultRenderParameters(req)
        params.title += ' - Login'
        params.notification = {
          type: 'success',
          message: 'User created! Now you can login.',
        }

        res.render('users/login', params)
      } catch (err) {
        log.error(err)

        await renderWithError(
          req,
          res,
          'users/register',
          'Register',
          'Error in user register. Contact support.'
        )
      }
    }
  }
}

const loginView = async (req, res) => {
  log.info('GET /login route requested')

  const params = await defaultRenderParameters(req)
  params.title += ' - Login'

  res.render('users/login', params)
}

const loginUser = async (req, res) => {
  log.info('POST /login route requested')

  const { email, password } = req.body

  // Check required fields
  if (!email || !password) {
    await renderWithError(
      req,
      res,
      'users/login',
      'Login',
      'You must fill all fields'
    )
  } else {
    // Authenticate User
    passport.authenticate('local', {
      successRedirect: '/user-home',
      failureRedirect: '/login?type=error&notification=Wrong login data. Insert correct data.',
      failureFlash: true,
    })(req, res)
  }
}

const logoutUser = (req, res, next) => {
  log.info('GET /logout route requested')

  req.session.user = null
  req.session.save((err) => {
    if (err) next(err)

    req.session.regenerate((err) => {
      if (err) next(err)

      res.redirect('/')
    })
  })
}

// Redirect User based on type
const renderUserHome = (req, res) => {
  log.info('GET /user-home route requested')

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
  logoutUser,
  renderUserHome,
}
