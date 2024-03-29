import bcrypt from 'bcrypt'

export class UserController {
  constructor ({ userModel }) {
    this.model = userModel
  }

  getAll = async (req, res, next) => {
    const users = await this.model.find().populate('books', {
      title: 1,
      author: 1,
      rating: 1,
      userComment: 1
    })
    res.json(users)
  }

  getById = async (req, res, next) => {
    const { id } = req.params
    const user = await this.model.findById(id)
    if (user) {
      return res.json(user)
    }
    res.status(404).end('User not found')
  }

  create = async (req, res, next) => {
    const { name, email, password, photo } = req.body
    const passwordHash = await bcrypt.hash(password, 10)
    const User = this.model
    const user = new User({
      name,
      email,
      password: passwordHash,
      photo
    })
    try {
      const savedUser = await user.save()
      res.status(201).json(savedUser)
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json(error?.message)
      }
      next(error)
    }
  }

  update = async (req, res, next) => {
    const { id } = req.params
    const { name, email, password, photo } = req.body

    try {
      const updatedUser = await this.model.findByIdAndUpdate(
        id,
        { name, email, password, photo },
        { new: true, runValidators: true, context: 'query' }
      )

      if (updatedUser) {
        return res.json(updatedUser)
      }
      res.status(404).end('User not found')
    } catch (error) {
      next(error)
    }
  }

  delete = async (req, res, next) => {
    const { id } = req.params
    try {
      const removedUser = await this.model.findByIdAndDelete(id)
      if (removedUser) {
        return res.status(204).json(removedUser)
      }
      res.status(404).end('User not found')
    } catch (error) {
      next(error)
    }
  }
}
