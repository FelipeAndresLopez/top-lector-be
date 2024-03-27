// external dependencies
import express from 'express'
import cors from 'cors'
import 'dotenv/config'

// utils
import './mongo.js'

// models
import { User } from './models/User.js'
import { Book } from './models/Book.js'

// routes
import { createUseRouter as createUserRouter } from './routes/users.js'
import { createBookRouter } from './routes/books.js'

const app = express()

// disable x-powered-by header
app.disable('x-powered-by')

const PORT = process.env.PORT

// cors middleware
app.use(cors())

// body parser middleware
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Top Lector')
})

app.use('/api/users', createUserRouter({ userModel: User }))
app.use('/api/books', createBookRouter({ bookModel: Book }))

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

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

export { app, server }
