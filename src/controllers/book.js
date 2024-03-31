import { User } from '../models/User.js'
import jwt from 'jsonwebtoken'

export class BookController {
  constructor ({ bookModel }) {
    this.model = bookModel
  }

  getAll = async (req, res, next) => {
    const books = await this.model.find().populate('user', {
      books: 0
    })
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
    const authorization = req.headers.authorization
    let token = null

    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
      token = authorization.split(' ')[1]
    }

    let decodedToken = null

    try {
      decodedToken = jwt.verify(token, process.env.SECRET)
    } catch {}

    if (!token || !decodedToken?.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    const userId = decodedToken?.id

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
      if (error.name === 'ValidationError') {
        return res.status(400).json(error?.message)
      }
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
    try {
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
