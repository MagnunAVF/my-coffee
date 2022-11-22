const Post = prisma.post

const setGlobalPosts = async () => {
  global.posts = await Post.findMany({ include: { owner: true } })
}

const getPosts = async () => {
  const posts = await Post.findMany({ include: { owner: true } })

  return posts
}

const getPostById = async (id) => {
  const posts = await Post.findUnique({
    where: { id },
    include: { owner: true },
  })

  return posts
}

const getPostByTitle = async (title) => {
  const posts = await Post.findUnique({ where: { title } })

  return posts
}

const deletePost = async (id) => {
  await Post.delete({
    where: { id },
  })
}

// TODO -> Check how to add owner with connect
const createPost = async (attributes, user) => {
  const data = {
    ...attributes,
    owner: {
      connect: { id: user.id },
    },
  }

  await Post.create({
    data,
    include: {
      owner: true,
    },
  })
}

const updatePost = async (id, data) => {
  await Post.update({
    where: { id },
    data,
  })
}

module.exports = {
  Post,
  setGlobalPosts,
  getPosts,
  getPostById,
  deletePost,
  createPost,
  updatePost,
  getPostByTitle,
}
