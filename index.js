// external dependencies
import express from 'express'
import cors from 'cors'
import 'dotenv/config'

// utils
import './mongo.js'

// models
import { User } from './models/User.js'

const app = express()

// disable x-powered-by header
app.disable('x-powered-by')

const PORT = process.env.PORT

// cors middleware
app.use(cors())

// body parser middleware
app.use(express.json())

app.get('/api/users', (req, res) => {
  User.find()
    .then((users) => {
      res.json(users)
    })
})

app.get('/api/users/:id', (req, res, next) => {
  const { id } = req.params
  User.findById(id)
    .then((user) => {
      if (user) {
        return res.json(user)
      }
      res.status(404).end('User not found')
    })
    .catch((err) => next(err))
})

app.delete('/api/users/:id', (req, res, next) => {
  const { id } = req.params
  User.findByIdAndDelete(id)
    .then((user) => {
      if (user) {
        return res.json(user)
      }
      res.status(404).end('User not found')
    })
    .catch((err) => next(err))
})

app.post('/api/users', (req, res, next) => {
  const { name, email, password, photo } = req.body
  const user = new User({
    name,
    email,
    password,
    photo
  })
  user
    .save()
    .then((savedUser) => {
      res.json(savedUser)
    })
})

app.put('/api/users/:id', (req, res, next) => {
  const { id } = req.params
  const { name, email, password, photo } = req.body
  User.findByIdAndUpdate(id, { name, email, password, photo }, { new: true, runValidators: true, context: 'query' })
    .then((updatedUser) => {
      if (updatedUser) {
        return res.json(updatedUser)
      }
      res.status(404).end('User not found')
    })
    .catch((err) => next(err))
})

app.use((error, req, res, next) => {
  console.error(error)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  res.status(500).end()
})

app.use((req, res, next) => {
  res.status(404).send('Not Found')
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

export default app
