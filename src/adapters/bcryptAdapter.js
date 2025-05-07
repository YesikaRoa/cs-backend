import bcrypt from 'bcryptjs'

export const BcryptAdapter = {
  hash: async (data, saltRounds = 10) => {
    return await bcrypt.hash(data, saltRounds)
  },

  compare: async (data, hashedData) => {
    return await bcrypt.compare(data, hashedData)
  },
}
