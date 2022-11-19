const TITLE_PREFIX = 'My Coffee'

const defaultRenderParameters = () => {
  return {
    title: TITLE_PREFIX,
    notification: false,
    user: false,
  }
}

const renderWithError = (res, page, pageTitle, message) => {
  log.warn(message)

  const params = defaultRenderParameters()
  params.title = `${TITLE_PREFIX} - ${pageTitle}`
  params.notification = { type: 'error', message }

  res.render(page, params)
}

module.exports = {
  defaultRenderParameters,
  renderWithError,
}
