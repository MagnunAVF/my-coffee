const adminDashboardView = (req, res) => {
  res.render('adminDashboard', {
    title: 'My Coffee - Admin Dashboard',
    notification: { type: 'success', message: 'Welcome admin !' },
  })
}

module.exports = {
  adminDashboardView,
}
