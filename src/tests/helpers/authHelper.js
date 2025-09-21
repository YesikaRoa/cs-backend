import { registerUser, loginUser } from './funtionsHelpers.js'

export async function registerAndLoginUser() {
  const unique = Date.now()
  const email = `testuser${unique}@example.com`
  const password = 'pas123'

  const user = await registerUser({
    email,
    password,
    first_name: 'Test',
    last_name: 'User',
    phone: `${unique}`,
    rol_id: 2,
    community_id: 1,
    dni: `${unique}`,
  })

  const { token } = await loginUser({ email, password })

  return { token, userId: user.id }
}
