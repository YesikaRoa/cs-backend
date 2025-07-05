import { PrismaClient, RoleType, CategoryType } from '@prisma/client'
import { BcryptAdapter } from '../src/adapters/bcryptAdapter.js'

const prisma = new PrismaClient()

const communities = [
  {
    id: 1,
    name: 'CONSEJO COMUNAL PIRINEOS I LOTE G',
    description: 'Consejo comunal enfocado en la fortaleza...',
    address: 'CALLE PRINCIPAL URB PIRINEOS I LOTE G  U-CCO-18-08-02-028726',
    name_clap: 'CLAP MARISCAL DE AYACUCHO DE PIRINEOS 1, LOTE H Y G',
    rif_community: 'RIF C- 299741680',
  },
  {
    id: 2,
    name: 'CONSEJO COMUNAL LOTE H-URB. RIO ZUÑIGA',
    description: 'Consejo comunal que trabaja activamente...',
    address: 'CALLE LOTE H SECTOR PIRINEOS I U-CCO-18-08-02-021335',
    name_clap: 'CLAP MARISCAL DE AYACUCHO DE PIRINEOS 1, LOTE H Y G',
    rif_community: 'RIF C- 316356205',
  },
  {
    id: 3,
    name: 'CONSEJO COMUNAL LIBERTADOR SINERAL',
    description: 'Consejo comunal conocido por su espíritu colaborativo...',
    address: 'PIRINEOS I LOTE D Y E U-CCO-18-08-02-006545',
    name_clap: 'CLAP LIBERTADOR PARTE BAJA',
    rif_community: 'RIF J- 29974178-7',
  },
  {
    id: 4,
    name: 'CONSEJO COMUNAL RAFAEL URDANETA',
    description: 'Consejo comunal que fomenta la unión vecinal...',
    address: 'BARRIO LIBERTADOR PARTE ALTA U-CCO-18-08-02-023981',
    name_clap: 'CLAP RAFAEL URDANETA DEL BARRIO LIBERTADOR PARTE ALTA',
    rif_community: 'RIF C- 500455747',
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

  // Obtener roles para usarlos después
  const adminRole = await prisma.role.findUnique({ where: { name: 'Admin' } })

  // 2. Insert Communities
  // await prisma.community.deleteMany({})
  for (const community of communities) {
    await prisma.community.upsert({
      where: { id: community.id },
      update: {
        name: community.name,
        description: community.description,
        address: community.address,
      },
      create: community,
    })
  }

  // // Hashear la contraseña una sola vez
  // const hashedPassword = await BcryptAdapter.hash('123456')

  // // 3. Insertar usuarios con los roles correctos y emails únicos
  // const users = [
  //   {
  //     email: 'admin@example.com',
  //     password: hashedPassword,
  //     first_name: 'Admin',
  //     last_name: 'User',
  //     cedula: '12345678',
  //     phone: '1234567890',
  //     rol_id: adminRole.id,
  //     community_id: 1,
  //     is_active: true,
  //   },
  // ]

  // for (const user of users) {
  //   await prisma.user.upsert({
  //     where: { email: user.email },
  //     update: {},
  //     create: user,
  //   })
  // }

  // 4. Insert Post Categories
  for (const categoryName of Object.values(CategoryType)) {
    await prisma.postCategory.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName },
    })
  }

  // 5. Insert permissions and assign to roles
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
  const hashedPassword = await BcryptAdapter.hash('abc123')

  await prisma.user.upsert({
    where: { email: 'serviciocomunitario599@gmail.com' },
    update: {},
    create: {
      email: 'serviciocomunitario599@gmail.com',
      password: hashedPassword,
      first_name: 'Admin',
      last_name: 'User',
      dni: '12345678',
      community: {
        connect: { id: 1 },
      },
      role: {
        connect: { id: adminRole.id },
      },
      url_image:
        'https://gravatar.com/avatar/c51e1cf841e009eec919ca2e1f7ed7a8?s=400&d=robohash&r=x',
    },
  })

  // 6. Insert community info
  const infoEntries = [
    {
      title: 'LOCATION',
      value: 'Barrio Libertador, Calle 4',
      community_id: 1,
    },
    {
      title: 'PHONE_NUMBER',
      value: '02123462092',
      community_id: 1,
    },
    {
      title: 'EMAIL',
      value: 'email@email.com',
      community_id: 1,
    },
    {
      title: 'MISSION',
      value:
        'Promover la participación activa de la comunidad en la gestión y solución de sus necesidades, fomentando el desarrollo social, económico y cultural con base en la organización popular y la corresponsabilidad.',
      community_id: 1,
    },
    {
      title: 'VISION',
      value:
        'Ser una comunidad organizada, solidaria y autosustentable, capaz de mejorar continuamente su calidad de vida mediante la unión, la planificación y el compromiso colectivo.',
      community_id: 1,
    },
    {
      title: 'ABOUT',
      value:
        'El Consejo Comunal Libertador es un espacio de organización y participación ciudadana que busca mejorar la calidad de vida de sus habitantes a través de la gestión colectiva y la articulación de esfuerzos en pro del bienestar común.',
      community_id: 1,
    },
  ]

  for (const info of infoEntries) {
    await prisma.communityInformation.upsert({
      where: {
        title_community_id: {
          title: info.title,
          community_id: info.community_id,
        },
      },
      update: {
        value: info.value,
      },
      create: {
        title: info.title,
        value: info.value,
        community_id: info.community_id,
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
