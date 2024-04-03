import { User } from '../models/User.js'

export class BookController {
  constructor ({ bookModel }) {
    this.model = bookModel
  }

  getAll = async (req, res, next) => {
    const books = await this.model.find()
    res.json(books)
  }

  getById = async (req, res, next) => {
    const { id } = req.params
    const book = await this.model.findById(id)
    try {
      if (book) {
        return res.json(book)
      }
      res.status(404).end('Book not found')
    } catch (error) {
      next(error)
    }
  }

  create = async (req, res, next) => {
    const { title, author, userComment, rating } = req.body
    const { userId } = req
    const user = await User.findById(userId)

    const Book = this.model
    const book = new Book({
      title,
      author,
      userComment,
      rating,
      user: user.id
    })

    try {
      const savedBook = await book.save()
      user.books = user.books.concat(savedBook._id)
      await user.save()
      res.status(201).json(savedBook)
    } catch (error) {
      next(error)
    }
  }

  update = async (req, res, next) => {
    const { id } = req.params
    const { title, author, userComment, rating } = req.body
    const book = {
      title,
      author,
      userComment,
      rating
    }
    try {
      const updatedBook = await this.model.findByIdAndUpdate(id, book, { new: true, runValidators: true })
      if (updatedBook) {
        return res.json(updatedBook)
      }
      res.status(404).end('Book not found')
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json(error?.message)
      }
      next(error)
    }
  }

  delete = async (req, res, next) => {
    const { id } = req.params
    const { userId } = req
    const user = await User.findById(userId)

    try {
      user.books = user.books.filter(book => book.toString() !== id)
      await user.save()
      const removedBook = await this.model.findByIdAndDelete(id)
      if (removedBook) {
        return res.json(removedBook)
      }
      res.status(404).end('Book not found')
    } catch (error) {
      next(error)
    }
  }
}
