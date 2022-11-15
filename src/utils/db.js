const checkDbConnection = async (dbClient) => {
  try {
    await dbClient.$queryRaw`SELECT 1`

    log.info('Postgres db is up!')
  } catch (error) {
    log.error(error)

    return error
  }
}

module.exports = {
  checkDbConnection,
}
