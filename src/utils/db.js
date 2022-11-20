const checkDbConnection = async (dbClient) => {
  await dbClient.$queryRaw`SELECT 1`

  log.info('Postgres db is up!')
}

module.exports = {
  checkDbConnection,
}
