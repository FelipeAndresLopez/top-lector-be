import { User } from '../models/User.js'

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

export const getAllUsers = async () => {
  const usersDB = await User.find({})
  return usersDB.map((user) => user.toJSON())
}
