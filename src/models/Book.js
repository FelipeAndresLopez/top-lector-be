import { model, Schema } from 'mongoose'

const bookSchema = Schema({
  title: String,
  author: String,
  userComment: String,
  rating: Number
})

bookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const Book = model('Book', bookSchema)
