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

const postsData = [
  {
    title: 'Benefício do Café - Melhorar memória e concentração',
    content:
      'Por ser rico em cafeína, um composto estimulante do sistema nervoso central, o café ajuda a melhorar a memória e o estado de alerta, além de aumentar a capacidade de concentração e diminuir o sono.',
  },
  {
    title: 'Benefício do Café - Evitar a depressão',
    content:
      'Os polifenóis presentes em ótimas quantidades no café combatem os radicais livres e diminuem inflamações nas células do sistema nervoso central, o que contribui para reduzir a ansiedade e melhorar o humor, prevenindo quadros de depressão.',
  },
]

const categoriesData = [
  {
    name: 'Acessórios',
  },
  {
    name: 'Eletrônicos',
  },
  {
    name: 'Café em Grãos',
  },
  {
    name: 'Café',
  },
]

const productsData = [
  {
    name: 'Jarra de vidro Hario 360 ml',
    description:
      'Perfeitamente desenhada para acomodar todos os coadores Hario V60, a jarra Range Server, em sua versão de 360ml, é o máximo em design e elegância ao servir um café. Você prepara seu café em um coador Hario diretamente na jarra, sem necessidade de suporte.',
    price: 244.01,
    imageUrl:
      'https://cafestore.vteximg.com.br/arquivos/ids/158004-1000-1000/hario-jarra360ml-vidro4.jpg?v=637277852841930000',
    categories: ['Acessórios'],
  },
  {
    name: 'Cafeteira Individual com Moedor Hamilton Beach Preta 2 Xícaras 127V',
    description:
      'Uma das chaves para um café saboroso é usar grãos moídos na hora. Com a cafeteira individual com moedor automático da Hamilton Beach, você pode moer seus grãos de café favoritos e preparar até 400 ml de café coado imediatamente. Basta encher a câmara de moagem com os grãos, adicionar água e pressionar o botão moer / preparar. a cafeteira moerá automaticamente os grãos e distribuirá o café moído no filtro permanente.',
    price: 949.33,
    imageUrl:
      'https://cafestore.vteximg.com.br/arquivos/ids/161013-1000-1000/3276_Cafeteira-Individual-com-Moedor-Hamilton-Beach-Preta-2-Xicaras-127V_1.jpg?v=638010102017700000',
    categories: ['Eletrônicos'],
  },
  {
    name: 'Café Black Tucano Honey Coffee em grãos 250 g',
    description:
      'O café mais exótico da Black Tucano e que é uma edição limitada.Tradicionalmente conhecido como café de mel, é um café de origem única e processos nobres, cultivado artesanalmente nas Montanhas do Espírito Santo.',
    price: 37.55,
    imageUrl:
      'https://cafestore.vteximg.com.br/arquivos/ids/158257-1000-1000/cafe-black-tucano-honey.jpg?v=637296384377100000',
    categories: ['Café', 'Café em Grãos'],
  },
  {
    name: 'Café Constantino em grãos 250g',
    description:
      'Café especial, de origem única com grãos cuidadosamente selecionados em seu máximo ponto de maturação. Um café que agrada os mais exigentes dos paladares, com sabor frutado, notas de chocolate e nozes, em um blend especial das variedades Mundo Novo e Catauí Amarelo, que resultam em um café equilibrado, cremoso e aveludado.',
    price: 23.62,
    imageUrl:
      'https://cafestore.vteximg.com.br/arquivos/ids/158088-1000-1000/cafe-constantino-graos-250g.jpg?v=637279166559070000',
    categories: ['Café', 'Café em Grãos'],
  },
  {
    name: 'Café Black Tucano Premium Blend em grãos 250 g',
    description:
      'Um blend para clientes especiais apreciadores de uma deliciosa combinação de cafés de diferentes origens. Em sua composição principal, disponibilizaremos grãos originários das melhores fazendas do Sul de Minas, Cerrado Mineiro e Mogiana Paulista.',
    price: 32.77,
    imageUrl:
      'https://cafestore.vteximg.com.br/arquivos/ids/158259-1000-1000/cafe-black-tucano-premium.jpg?v=637296386167270000',
    categories: ['Café', 'Café em Grãos'],
  },
]

let createdCategories = {}

const createUser = async (user) => {
  try {
    // Password Hashing
    const salt = await bcrypt.genSalt(10)
    const encryptedPassword = await bcrypt.hash(user.password, salt)

    // Add posts in admin user
    let createParams = {
      data: {
        ...user,
        password: encryptedPassword,
      },
    }

    if (user.type === 'admin') {
      createParams.include = { posts: true }
      createParams.data.posts = {
        create: postsData,
      }
    }

    // Create User
    const createdUser = await prismaClient.user.create(createParams)

    log.info(`* Created ${user.type} user with id: ${createdUser.id}`)
    if (user.type === 'admin') log.info(' ** Also created admin user posts')
  } catch (error) {
    log.error(`Error creating user: ${error}`)

    throw error
  }
}

const createCategory = async (category) => {
  try {
    const { name } = category

    // Create Category
    const createdCategory = await prismaClient.category.create({
      data: {
        name,
      },
    })

    const categoryId = createdCategory.id
    createdCategories[name] = categoryId
    log.info(`* Created category with id: ${categoryId}`)
  } catch (error) {
    log.error(`Error creating category: ${error}`)

    throw error
  }
}

const createProduct = async (product) => {
  try {
    // find categories ids created in db
    const categoriesIds = Object.keys(createdCategories)
      .filter((e) => product.categories.includes(e))
      .map((e) => createdCategories[e])

    // Create Product
    const createdProduct = await prismaClient.product.create({
      data: {
        ...product,
        categories: {
          create: categoriesIds.reduce(
            (acc, val) => [
              ...acc,
              {
                category: {
                  connect: {
                    id: val,
                  },
                },
              },
            ],
            []
          ),
        },
      },
    })

    log.info(`* Created product with id: ${createdProduct.id}`)
  } catch (error) {
    log.error(`Error creating product: ${error}`)

    throw error
  }
}

const getDbData = async () => {
  log.info('\n* Getting db data ...')

  log.info('\n* Users:')
  const users = await prismaClient.user.findMany()
  users.map((user) => {
    log.info('\n** User infos:')
    log.info(user)
  })

  log.info('\n* Posts:')
  const posts = await prismaClient.post.findMany({ include: { owner: true } })
  posts.map((post) => {
    const { name, type } = post.owner
    delete post['owner']

    log.info('\n** Post infos:')
    log.info(post)
    log.info('*** Post Owner:')
    log.info(`name: ${name} ; user type: ${type}`)
  })

  log.info('\n* Categories:')
  const categories = await prismaClient.category.findMany()
  categories.map((category) => {
    log.info('\n** Category infos: ')
    log.info(category)
  })

  log.info('\n* Products:')
  const products = await prismaClient.product.findMany({
    include: { categories: { include: { category: true } } },
  })

  products.map(async (product) => {
    const categories = product.categories
    delete product['categories']

    log.info('\n** Product infos: ')
    log.info(product)
    log.info('*** Product categories: ')
    log.info(categories.map((e) => e.category.name))
  })

  log.info('\n### Done!\n')
}

const main = async () => {
  log.info('\n### Start seeding ...')

  try {
    // Create users
    await Promise.all(
      usersData.map(async (user) => {
        await createUser(user)
      })
    )

    // Create categories
    await Promise.all(
      categoriesData.map(async (category) => {
        await createCategory(category)
      })
    )

    // Create products
    await Promise.all(
      productsData.map(async (product) => {
        await createProduct(product)
      })
    )
  } catch (error) {
    log.error('\n### Error seeding data!')
    process.exit(1)
  }

  log.info('\n### Seeding finished!')

  log.info('\n### Created data:')

  await getDbData()
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
