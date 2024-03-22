import supertest from 'supertest'
import { app } from '../index.js'
const api = supertest(app)

export const mockUsers = [
  {
    name: 'John Doe',
    email: 'K9hQH@example.com',
    password: 'password',
    photo: 'https://example.com/johndoe.jpg',
    books: []
  },
  {
    name: 'Jane Doe',
    email: 'jK9hQH@example.com',
    password: 'password',
    photo: 'https://example.com/janedoe.jpg',
    books: []
  }
]

export const getAllUsers = async ({ key = 'name' } = {}) => {
  const response = await api.get('/api/users')
  const data = response.body.map((user) => user[key])
  return {
    response,
    data
  }
}
