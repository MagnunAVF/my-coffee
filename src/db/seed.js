const prisma = require('@prisma/client')
const bcrypt = require('bcryptjs')
const log = require('loglevel')
log.enableAll()

const prismaClient = new prisma.PrismaClient()

const usersData = [
  {
    name: 'Master Blaster',
    email: 'master@admin.com',
    type: 'admin',
    password: 'blasterAdmin*9',
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

const createUser = async (user) => {
  try {
    // Password Hashing
    const salt = await bcrypt.genSalt(10)
    const encryptedPassword = await bcrypt.hash(user.password, salt)
    const { name, email, type } = user

    const createdUser = await prismaClient.user.create({
      data: {
        name,
        email,
        password: encryptedPassword,
        type,
      },
    })

    log.info(`Created user with id: ${createdUser.id}`)
  } catch (error) {
    log.error(`Error creating user: ${error}`)
  }
}

const main = async () => {
  log.info('Start seeding ...')

  for await (const user of usersData) {
    await createUser(user)
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
