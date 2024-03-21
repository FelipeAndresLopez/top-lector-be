import { model, Schema } from 'mongoose'

const userSchema = Schema({
  name: String,
  email: String,
  password: String,
  photo: String
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const User = model('User', userSchema)
