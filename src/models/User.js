import uniqueValidator from 'mongoose-unique-validator'
import { model, Schema } from 'mongoose'

const userSchema = Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  photo: String,
  books: [{ type: Schema.Types.ObjectId, ref: 'Book' }]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.password
  }
})

userSchema.plugin(uniqueValidator, { message: '{VALUE} already in use' })

export const User = model('User', userSchema)
