import { prisma } from '../config/db.js'

const categoryTranslations = {
  Project: 'Proyecto',
  Event: 'Evento',
  News: 'Noticias',
  Announcement: 'Anuncio',
}

export const getPostCategories = async () => {
  const categories = await prisma.postCategory.findMany()

  return categories.map((category) => ({
    id: category.id,
    name: categoryTranslations[category.name],
  }))
}
