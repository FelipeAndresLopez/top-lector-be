import { Router } from 'express'
import { BookController } from '../controllers/book.js'

export const createBookRouter = ({ bookModel }) => {
  const bookController = new BookController({ bookModel })
  const bookRouter = Router()
  bookRouter.get('/', bookController.getAll)
  bookRouter.get('/:id', bookController.getById)
  bookRouter.post('/', bookController.create)
  bookRouter.put('/:id', bookController.update)
  bookRouter.delete('/:id', bookController.delete)
  return bookRouter
}
