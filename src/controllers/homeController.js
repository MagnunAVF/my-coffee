const homeView = (req, res) => {
  res.render('index', { title: 'My Coffee - Home Page', notification: false })
}

module.exports = {
  homeView,
}
