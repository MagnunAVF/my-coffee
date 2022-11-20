const Post = prisma.post

const setGlobalPosts = async () => {
  global.posts = await Post.findMany({ include: { owner: true } })
}

module.exports = {
  Post,
  setGlobalPosts,
}
