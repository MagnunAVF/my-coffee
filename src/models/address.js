const Address = prisma.address

const getAddressesByUserId = async (userId) => {
  const address = await Address.findMany({
    where: { owner: { id: userId } },
    include: { owner: true },
  })

  return address
}

// TODO -> Check how to add owner with connect
const createAddress = async (attributes, user) => {
  const data = {
    ...attributes,
    owner: {
      connect: { id: user.id },
    },
  }

  await Address.create({
    data,
    include: {
      owner: true,
    },
  })
}

const updateAddress = async (id, data) => {
  await Address.update({
    where: { id },
    data,
  })
}

module.exports = {
  getAddressesByUserId,
  createAddress,
  updateAddress,
}
