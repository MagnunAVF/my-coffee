const homeView = (req, res) => {
  res.render('index', { title: 'My Coffee - Home Page' })
}

module.exports = {
  homeView,
}
