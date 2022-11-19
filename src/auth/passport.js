const bcrypt = require('bcryptjs')
const passportLocal = require('passport-local')

const { User } = require('../models/user')

const LocalStrategy = passportLocal.Strategy

const loginCheck = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Check if email exists
      User.findUnique({ where: { email } })
        .then({ email: email })
        .then((user) => {
          if (!user) {
            log.warn(`Email ${email} not exists`)

            return done()
          }

          // Check password
          bcrypt.compare(password, user.password, (error, isMatch) => {
            if (error) throw error

            if (isMatch) {
              return done(null, user)
            } else {
              log.warn('Wrong password')

              return done()
            }
          })
        })
        .catch((error) => log.error(error))
    })
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findUnique({ where: { id } })
      .then((user) => done(null, user))
      .catch((err) => done(err, null))
  })
}

module.exports = {
  loginCheck,
}
