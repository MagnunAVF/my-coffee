const nodemailer = require('nodemailer')
let ejs = require('ejs')
const path = require('path')

const setup = () => {
  let nodemailerOptions = {
    host: process.env.SMTP_SERVER_ADDRESS,
    port: parseInt(process.env.SMTP_SERVER_PORT),
    ignoreTLS: false,
    tls: {
      maxVersion: 'TLSv1.2',
      minVersion: 'TLSv1.2',
    },
    auth: {
      type: 'login',
      user: process.env.SMTP_SERVER_USER,
      pass: process.env.SMTP_SERVER_PASSWORD,
    },
    logger: true,
    debug: false,
  }
  if (process.env.ENV !== 'production') {
    nodemailerOptions.port = 1025
    nodemailerOptions.ignoreTLS = true
    nodemailerOptions.debug = true
  }

  // return a created Transport
  return nodemailer.createTransport(nodemailerOptions, {
    from: process.env.DEFAULT_FROM_EMAIL,
  })
}

const sendEmail = async (template, toEmail, subject, data) => {
  const transporter = setup()

  try {
    const emailContent = await buildEmail(template, data)

    const message = {
      from: process.env.DEFAULT_FROM_EMAIL,
      to: toEmail,
      subject: subject,
      html: emailContent,
    }

    await transporter.sendMail(message)

    log.info(`[Email] - Message sent to ${toEmail}`)
  } catch (error) {
    log.error(`[Email] - Error sending message: ${error}`)
  } finally {
    transporter.close()
  }
}

// helpers
const buildEmail = async (template, data) => {
  try {
    const templateFile = path.join(__dirname, `templates/${template}.ejs`)

    const content = await ejs.renderFile(templateFile, data, {})

    return content
  } catch (error) {
    log.error(error)
    throw error
  }
}

module.exports = {
  sendEmail,
}
