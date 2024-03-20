// external dependencies
import express from 'express'
import 'dotenv/config'

// utils
import './mongo.js'

// models
import { User } from './models/User.js'

const app = express()

// disable x-powered-by header
app.disable('x-powered-by')

const PORT = process.env.PORT

// body parser middleware
app.use(express.json())

app.get('/api/users', (req, res) => {
  User.find()
    .then((users) => {
      res.json(users)
    })
})

app.get('/api/users/:id', (req, res) => {
  const { id } = req.params
  User.find({ _id: id })
    .then((user) => {
      if (!user) {
        res.status(404).send('User not found')
      }
      res.json({ user })
    })
    .catch((err) => {
      res.status(500).send(err)
    })
})

app.use((req, res, next) => {
  res.status(404).send('Not Found')
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
