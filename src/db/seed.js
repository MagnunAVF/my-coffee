const prisma = require('@prisma/client')
const log = require('loglevel')
log.enableAll()

const prismaClient = new prisma.PrismaClient()

const userData = [
  {
    name: 'Master Blaster',
    email: 'master@admin.com',
    type: 'admin',
    password: 'masteradmin',
  },
  {
    name: 'Nilu',
    email: 'nilu@test.com',
    type: 'client',
    password: 'nilu',
  },
  {
    name: 'Mahmoud',
    email: 'mahmoud@test.com',
    type: 'client',
    password: 'mahmoud',
  },
]

async function main() {
  log.info('Start seeding ...')
  for (const u of userData) {
    const user = await prismaClient.user.create({
      data: u,
    })
    log.info(`Created user with id: ${user.id}`)
  }
  log.info('Seeding finished.')
}

main()
  .then(async () => {
    await prismaClient.$disconnect()
  })
  .catch(async (e) => {
    log.error(e)
    await prismaClient.$disconnect()
    process.exit(1)
  })
