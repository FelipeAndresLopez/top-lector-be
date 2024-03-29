import { Router } from 'express'
import { LoginController } from '../controllers/login.js'

export const createLoginRouter = ({ userModel }) => {
  const loginController = new LoginController({ userModel })
  const loginRouter = Router()
  loginRouter.post('/', loginController.login)
  return loginRouter
}
