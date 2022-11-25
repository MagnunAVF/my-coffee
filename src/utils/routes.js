const matchRoute = (route, routes) => {
  let found = false

  for (let index = 0; index < routes.length; index++) {
    const r = routes[index]

    if (r.endsWith('/*')) {
      if (route.startsWith(r.replace('/*', ''))) {
        found = true
        break
      }
    } else {
      if (r === route) {
        found = true
        break
      }
    }
  }

  return found
}

module.exports = {
  matchRoute,
}
