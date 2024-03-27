import mongoose from 'mongoose'
import supertest from 'supertest'
import { app, server } from '../index.js'
import { User } from '../models/User.js'
import { getAllUsers, mockUsers } from './helpers.js'

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  // create mock users in parallel this is the fastest way
  // const userObjects = mockUsers.map((user) => new User(user))
  // const promiseArray = userObjects.map((user) => user.save())
  // await Promise.all(promiseArray)

  // create mock users in series
  for (const user of mockUsers) {
    const userObject = new User(user)
    await userObject.save()
  }
})

describe('GET all users', () => {
  test('users  are returned as json', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /json/)
    expect(response.body).toHaveLength(mockUsers.length)
  })
})

describe('POST a new user', () => {
  test('a user can be created', async () => {
    const usersAtStart = await getAllUsers()
    const newUser = {
      name: 'John Doe',
      email: 'jhondoe@me.com',
      password: 'password',
      photo: 'https://example.com/johndoe.jpg',
      books: []
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    const usersAtEnd = await getAllUsers()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    const emails = usersAtEnd.map((u) => u.email)
    expect(emails).toContain(newUser.email)
  })

  test('creation fails with proper status code and message if user already exists', async () => {
    const usersAtStart = await getAllUsers()

    const newUser = {
      name: 'John Doe',
      email: 'K9hQH@example.com',
      password: 'password',
      photo: 'https://example.com/johndoe.jpg',
      books: []
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.errors.email.message).toContain('`email` to be unique')
    const usersAtEnd = await getAllUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

describe('DELETE a user', () => {
  test('a user can be deleted', async () => {
    const usersAtStart = await getAllUsers()
    await api
      .delete(`/api/users/${usersAtStart[0].id}`)
      .expect(204)

    const usersAtEnd = await getAllUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length - 1)
    expect(usersAtEnd).not.toContain(usersAtStart[0])
  })

  test('a user that does not exist can not be deleted', async () => {
    const users = await getAllUsers()
    await api
      .delete('/api/users/123456')
      .expect(400)

    expect(users).toHaveLength(users.length)
  })
})

afterAll(() => {
  server.close()
  mongoose.connection.close()
})
