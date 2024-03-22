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
    const newUser = {
      name: 'John Doe',
      email: 'K9hQH@example.com',
      password: 'password',
      photo: 'https://example.com/johndoe.jpg',
      books: []
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)

    const { data: emails, response } = await getAllUsers({ key: 'email' })

    expect(response.body).toHaveLength(mockUsers.length + 1)
    expect(emails).toContain(newUser.email)
  })
})

describe('DELETE a user', () => {
  test('a user can be deleted', async () => {
    const { response: responseBeforeDelete } = await getAllUsers()
    const users = responseBeforeDelete.body
    await api
      .delete(`/api/users/${users[0].id}`)
      .expect(204)

    const { response: responseAfterDelete } = await getAllUsers()
    expect(responseAfterDelete.body).toHaveLength(mockUsers.length - 1)
    expect(responseAfterDelete.body).not.toContain(users[0])
  })

  test('a user that does not exist can not be deleted', async () => {
    const { response } = await getAllUsers()
    await api
      .delete('/api/users/123456')
      .expect(400)

    expect(response.body).toHaveLength(mockUsers.length)
  })
})

afterAll(() => {
  server.close()
  mongoose.connection.close()
})
