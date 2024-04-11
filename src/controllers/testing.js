import { Book } from '../models/Book.js'
import { User } from '../models/User.js'

export class TestingController {
  resetDatabase = async (req, res, next) => {
    await Book.deleteMany({})
    await User.deleteMany({})
    res.status(204).end()
  }
}
