import { PrismaClient, RoleType, CategoryType } from '@prisma/client'

import { BcryptAdapter } from '../src/adapters/bcryptAdapter.js'
const prisma = new PrismaClient()
const communities = [
  {
    id: 1,
    name: 'Lote G Pirineos I',
    description:
      'Consejo comunal enfocado en el fortalecimiento de la seguridad y la calidad de vida de sus habitantes',
    address: 'Desde Lote G, hasta antes de la calle del hambre',
  },
  {
    id: 2,
    name: 'Lote H Rio Zuñiga',
    description:
      'Consejo comunal que trabaja activamente en la conservación ambiental y la mejora de espacios públicos',
    address: 'Calle del hambre',
  },
  {
    id: 3,
    name: 'Libertador Cineral',
    description:
      'Consejo comunal conocido por su espíritu colaborativo y sus iniciativas en educación y desarrollo social.',
    address: 'Desde la sede de los Bomberos, hasta la calle 2',
  },
  {
    id: 4,
    name: 'Rafael Urdaneta',
    description:
      'Consejo comunal que fomenta la unión vecinal y proyectos culturales en la parroquia Pedro María Morantes.',
    address: 'Desde la licorería Isabelita, hasta Lote G',
  },
  {
    id: 5,
    name: 'Libertador',
    description:
      'Consejo comunal comprometido con el bienestar vecinal, destacada por sus actividades recreativas y programas comunitarios.',
    address: 'Desde la calle 2, hasta la licorería Isabelita',
  },
]

async function main() {
  // 1. Insert Roles
  for (const roleName of Object.values(RoleType)) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    })
  }

  // 2. Insert Communities
  // Eliminamos todas las comunidades existentes (la eliminación en cascada se encargará de los registros relacionados)
  await prisma.community.deleteMany({})

  // Insertamos las nuevas comunidades
  for (const community of communities) {
    await prisma.community.create({
      data: community,
    })
  }

  // 3. Insert Post Categories
  for (const categoryName of Object.values(CategoryType)) {
    await prisma.postCategory.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName },
    })
  }

  // 4. Optionally insert permissions and assign to roles
  const permissions = [
    'create_post',
    'edit_post',
    'delete_post',
    'view_reports',
  ]
  for (const name of permissions) {
    await prisma.permission.upsert({
      where: { name },
      update: {},
      create: {
        name,
        description: `${name} permission`,
      },
    })
  }

  // Assign all permissions to Admin role
  const adminRole = await prisma.role.findUnique({ where: { name: 'Admin' } })
  for (const name of permissions) {
    const permission = await prisma.permission.findUnique({ where: { name } })
    await prisma.rolePermission.upsert({
      where: {
        role_id_permission_id: {
          role_id: adminRole.id,
          permission_id: permission.id,
        },
      },
      update: {},
      create: {
        role_id: adminRole.id,
        permission_id: permission.id,
      },
    })
  }

  // 5. Optionally insert a first admin user
  const hashedPassword = await BcryptAdapter.hash('123456')

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      first_name: 'Admin',
      last_name: 'User',
      rol_id: adminRole.id,
      community_id: 1,
    },
  })

  const infoEntries = [
    {
      title: 'LOCATION',
      value: 'Barrio Libertador, Calle 4',
    },
    {
      title: 'PHONE_NUMBER',
      value: '02123462092',
    },
    {
      title: 'EMAIL',
      value: 'email@email.com',
    },
    {
      title: 'MISSION',
      value:
        'Promover la participación activa de la comunidad en la gestión y solución de sus necesidades, fomentando el desarrollo social, económico y cultural con base en la organización popular y la corresponsabilidad.',
    },
    {
      title: 'VISION',
      value:
        'Ser una comunidad organizada, solidaria y autosustentable, capaz de mejorar continuamente su calidad de vida mediante la unión, la planificación y el compromiso colectivo.',
    },
    {
      title: 'ABOUT',
      value:
        'El Consejo Comunal Libertador es un espacio de organización y participación ciudadana que busca mejorar la calidad de vida de sus habitantes a través de la gestión colectiva y la articulación de esfuerzos en pro del bienestar común.',
    },
  ]

  for (const info of infoEntries) {
    await prisma.communityInformation.upsert({
      where: { title: info.title },
      update: { value: info.value },
      create: {
        title: info.title,
        value: info.value,
      },
    })
  }

  console.log('✅ Seeding complete')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
