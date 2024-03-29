import { Router } from 'express'
import { UserController } from '../controllers/user.js'

export const createUserRouter = ({ userModel }) => {
  const userController = new UserController({ userModel })
  const usersRouter = Router()
  usersRouter.get('/', userController.getAll)
  usersRouter.get('/:id', userController.getById)
  usersRouter.post('/', userController.create)
  usersRouter.put('/:id', userController.update)
  usersRouter.delete('/:id', userController.delete)
  return usersRouter
}
