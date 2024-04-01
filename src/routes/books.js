import { Router } from 'express'
import { BookController } from '../controllers/book.js'
import { userExtractor } from '../middleware/userExtractor.js'

export const createBookRouter = ({ bookModel }) => {
  const bookController = new BookController({ bookModel })
  const bookRouter = Router()
  bookRouter.get('/', bookController.getAll)
  bookRouter.get('/:id', bookController.getById)
  bookRouter.post('/', userExtractor, bookController.create)
  bookRouter.put('/:id', userExtractor, bookController.update)
  bookRouter.delete('/:id', userExtractor, bookController.delete)
  return bookRouter
}
