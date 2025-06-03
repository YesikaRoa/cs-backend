import { getCommunityNames } from '../services/community.service.js'

const fetchCommunityNames = async (req, res, next) => {
  try {
    const communities = await getCommunityNames()
    res.status(200).json({ data: communities })
  } catch (error) {
    next(error)
  }
}

export default fetchCommunityNames
