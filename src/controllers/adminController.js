const { getMonthOrders } = require('../models/order')
const { defaultRenderParameters } = require('../utils/response')

const adminDashboardView = async (req, res) => {
  log.info('GET /admin route requested')

  const params = await defaultRenderParameters(req)
  params.title += ' - Painel Admin'

  res.render('adminDashboard', params)
}

const generateSalesReport = async (req, res) => {
  log.info('GET /sales-report route requested')

  const orders = await getMonthOrders()
  let ordersTotalAmount = 0.0

  orders.forEach((o) => {
    ordersTotalAmount += o.total
  })

  const params = await defaultRenderParameters(req)
  params.title += ' - Relatório de Vendas'
  params.orders = orders
  params.ordersTotalAmount = ordersTotalAmount

  res.render('reports/sales', params)
}

module.exports = {
  adminDashboardView,
  generateSalesReport,
}
