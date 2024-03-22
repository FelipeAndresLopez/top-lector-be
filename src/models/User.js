import { model, Schema } from 'mongoose'

const userSchema = Schema({
  name: String,
  email: String,
  password: String,
  photo: String,
  books: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.password
  }
})

export const User = model('User', userSchema)
