const matchRoute = (route, routes) => {
  let found = false

  routes.forEach((r) => {
    if (r === route) {
      found = true
    }
  })

  return found
}

module.exports = {
  matchRoute,
}
