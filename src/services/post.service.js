import prisma from '../config/db.js'

//Crea un nuevo post
export const createPost = async (reqBody) => {
  const { title, content, category_id, user_id, community_id } = reqBody

  const data = {
    title,
    content,
    status: 'published',
    user_id,
    community_id,
    category_id,
  }

  const post = await prisma.post.create({ data })

  return post
}

//Obtiene todos los posts
export const getPosts = async () => {
  const posts = await prisma.post.findMany({
    include: {
      user: true,
      category: true,
      community: true,
    },
  })

  return posts
}

//obtener un post por id
export const getPostById = async (id) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      user: true,
      category: true,
    },
  })

  return post
}

//actualizar un post
export const updatePost = async (id, data) => {
  const updatedPost = await prisma.post.update({
    where: { id },
    data,
  })

  return updatedPost
}

//eliminar un post
export const deletePost = async (id) => {
  const deletedPost = await prisma.post.delete({
    where: { id },
  })

  return deletedPost
}
