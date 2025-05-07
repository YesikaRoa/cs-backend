import { PrismaClient, RoleType, CategoryType } from '@prisma/client'
import { BcryptAdapter } from '../src/adapters/bcryptAdapter.js'

const prisma = new PrismaClient()

async function main() {
  // 1. Insert Roles
  for (const roleName of Object.values(RoleType)) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    })
  }

  // 2. Insert at least one Community
  await prisma.community.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Default Community',
      description: 'Initial seed community',
      address: '123 Main Street',
    },
  })

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

  console.log('✅ Seeding complete')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
