import { model, Schema } from 'mongoose'

const bookSchema = Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String
  },
  userComment: String,
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }

})

bookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const Book = model('Book', bookSchema)
