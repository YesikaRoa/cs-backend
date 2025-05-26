import { getDashboardDataService } from '../services/dashboard.service.js'

export const getDashboardDataController = async (req, res, next) => {
  try {
    const data = await getDashboardDataService()
    res.status(200).json({ status: 200, data })
  } catch (error) {
    next(error)
  }
}
