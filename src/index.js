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
import { createUserRouter } from './routes/users.js'
import { createBookRouter } from './routes/books.js'
import { createLoginRouter } from './routes/login.js'
import { createTestingRouter } from './routes/testing.js'

// middlewares
import { handleErrors } from './middleware/handleErrors.js'

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
app.use('/api/login', createLoginRouter({ userModel: User }))

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', createTestingRouter())
}

app.use(handleErrors)

app.use((req, res, next) => {
  res.status(404).send('Not Found')
})

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

export { app, server }
