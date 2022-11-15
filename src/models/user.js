const prisma = require('@prisma/client')

const prismaClient = new prisma.PrismaClient()

const User = prismaClient.user

module.exports = {
  User,
}
