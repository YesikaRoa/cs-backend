import { prisma } from '../config/db.js'

export const getDashboardDataService = async (req) => {
  const user = req.user || {}
  const { community_id: communityId, rol_name: rolName } = user
  const isAdmin = rolName === 'Admin'

  const communityFilter = isAdmin ? {} : { community_id: communityId }

  // Últimos 5 usuarios logueados (solo de su comunidad si no es admin)
  const lastLogins = await prisma.user.findMany({
    where: {
      last_login: { not: null },
      ...communityFilter,
    },
    take: 5,
    orderBy: { last_login: 'desc' },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      community: { select: { name: true } },
      role: { select: { name: true } },
      last_login: true,
    },
  })

  const roleMap = {
    Admin: 'Administrador',
    Community_Leader: 'Líder de comunidad',
    Street_Leader: 'Líder de calle',
  }

  const formattedLastLogins = lastLogins.map((user) => ({
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    community: user.community.name,
    rol: roleMap[user.role.name] || 'Otro',
    last_login: user.last_login ? user.last_login.toISOString() : null,
  }))

  // Cargar categorías una sola vez
  const categories = await prisma.postCategory.findMany({
    select: { id: true, name: true },
  })

  const categoryMap = categories.reduce((acc, category) => {
    acc[category.id] = category.name
    return acc
  }, {})

  // Publicaciones del mes agrupadas por categoría
  const postsMonth = await prisma.post.groupBy({
    by: ['category_id'],
    _count: { id: true },
    where: {
      created_at: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        lte: new Date(),
      },
      ...communityFilter,
    },
  })

  const formattedPostsMonth = postsMonth.reduce((acc, post) => {
    const categoryName = categoryMap[post.category_id] || 'Otro'
    acc[categoryName] = (acc[categoryName] || 0) + post._count.id
    return acc
  }, {})

  // Publicaciones del año agrupadas por categoría
  const postsYear = await prisma.post.groupBy({
    by: ['category_id'],
    _count: { id: true },
    where: {
      created_at: {
        gte: new Date(new Date().getFullYear(), 0, 1),
        lte: new Date(),
      },
      ...communityFilter,
    },
  })

  const formattedPostsYear = postsYear.reduce((acc, post) => {
    const categoryName = categoryMap[post.category_id] || 'Otro'
    acc[categoryName] = (acc[categoryName] || 0) + post._count.id
    return acc
  }, {})

  // Publicaciones por mes (enero a diciembre)
  const postsPerMonth = Array(12).fill(0)

  const monthlyPosts = await prisma.post.findMany({
    where: {
      created_at: {
        gte: new Date(new Date().getFullYear(), 0, 1),
        lte: new Date(),
      },
      ...communityFilter,
    },
    select: { created_at: true },
  })

  monthlyPosts.forEach((post) => {
    const month = new Date(post.created_at).getMonth()
    postsPerMonth[month]++
  })

  return {
    last_logins: formattedLastLogins,
    posts_month: formattedPostsMonth,
    posts_year: formattedPostsYear,
    posts_per_month: postsPerMonth,
  }
}
