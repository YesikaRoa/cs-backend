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
    // Comunidad 4 - Pirineos I Lote G → community_id: 1
    {
      title: 'LOCATION',
      value:
        'Calle Principal Urb. Pirineos I Lote G, parroquia Pedro María Morantes, Municipio San Cristóbal, estado Táchira.',
      community_id: 1,
    },
    {
      title: 'PHONE_NUMBER',
      value: '0426-7270336 / 0412-6832106',
      community_id: 1,
    },
    {
      title: 'EMAIL',
      value: 'CCPIRINEOSILOTEG@GMAIL.COM',
      community_id: 1,
    },
    {
      title: 'MISSION',
      value:
        'Organizar y movilizar a la comunidad para la solución de problemas locales mediante la cooperación y la planificación participativa.',
      community_id: 1,
    },
    {
      title: 'VISION',
      value:
        'Alcanzar un desarrollo integral y armónico en la comunidad, fundamentado en la participación, la corresponsabilidad y la solidaridad.',
      community_id: 1,
    },
    {
      title: 'ABOUT',
      value:
        'El Consejo Comunal Pirineos I Lote G trabaja por el bienestar de sus habitantes a través del trabajo conjunto, la organización y la gestión transparente.',
      community_id: 1,
    },

    // Comunidad 3 - Lote H Urb. Río Zuñiga → community_id: 2
    {
      title: 'LOCATION',
      value:
        'Calle Lote H Sector Pirineos 1, parroquia Pedro María Morantes, Municipio San Cristóbal, estado Táchira.',
      community_id: 2,
    },
    {
      title: 'PHONE_NUMBER',
      value: '0424-7427766',
      community_id: 2,
    },
    {
      title: 'EMAIL',
      value: 'CONSEJOCOMUNALLOTEHURBZUNIGA@GMAIL.COM',
      community_id: 2,
    },
    {
      title: 'MISSION',
      value:
        'Promover iniciativas comunitarias que fortalezcan la participación ciudadana y mejoren las condiciones de vida del sector.',
      community_id: 2,
    },
    {
      title: 'VISION',
      value:
        'Ser un ejemplo de comunidad unida y proactiva, orientada al desarrollo humano, social y urbano sustentable.',
      community_id: 2,
    },
    {
      title: 'ABOUT',
      value:
        'El Consejo Comunal Lote H Urb. Río Zuñiga representa los intereses de sus vecinos con compromiso, transparencia y vocación de servicio.',
      community_id: 2,
    },

    // Comunidad 2 - Libertador Sineral → community_id: 3
    {
      title: 'LOCATION',
      value:
        'Calle Principal Sector Barrio Libertador (parte baja), parroquia Pedro María Morantes, Municipio San Cristóbal, estado Táchira.',
      community_id: 3,
    },
    {
      title: 'PHONE_NUMBER',
      value: '0424-7570848',
      community_id: 3,
    },
    {
      title: 'EMAIL',
      value: 'LUIS11ENERO2018@GMAIL.COM',
      community_id: 3,
    },
    {
      title: 'MISSION',
      value:
        'Impulsar el desarrollo integral de la comunidad mediante la participación activa de sus habitantes y la consolidación de una organización social sólida.',
      community_id: 3,
    },
    {
      title: 'VISION',
      value:
        'Consolidarse como una comunidad ejemplar en la gestión de proyectos sociales, promoviendo la equidad y el bienestar común.',
      community_id: 3,
    },
    {
      title: 'ABOUT',
      value:
        'El Consejo Comunal Libertador Sineral se enfoca en atender las necesidades del sector mediante acciones organizadas y con visión de futuro.',
      community_id: 3,
    },

    // Comunidad 1 - Rafael Urdaneta → community_id: 4
    {
      title: 'LOCATION',
      value:
        'Barrio Libertador (Parte Alta), parroquia Pedro María Morantes, Municipio San Cristóbal, estado Táchira.',
      community_id: 4,
    },
    {
      title: 'PHONE_NUMBER',
      value: '0414-0748775 / 0424-7347467',
      community_id: 4,
    },
    {
      title: 'EMAIL',
      value: 'CLAPBLIBERTADORPA@GMAIL.COM',
      community_id: 4,
    },
    {
      title: 'MISSION',
      value:
        'Fomentar la participación ciudadana y fortalecer los lazos comunitarios para mejorar la calidad de vida mediante la gestión colectiva y solidaria.',
      community_id: 4,
    },
    {
      title: 'VISION',
      value:
        'Ser una comunidad modelo en organización, participación y desarrollo sustentable a través del compromiso y la planificación conjunta.',
      community_id: 4,
    },
    {
      title: 'ABOUT',
      value:
        'El Consejo Comunal Rafael Urdaneta trabaja por el bienestar de sus habitantes desde una perspectiva participativa, solidaria y comprometida con el progreso colectivo.',
      community_id: 4,
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
