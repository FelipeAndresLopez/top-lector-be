import mongoose from 'mongoose'

const { MONGO_DB_URI, NODE_ENV } = process.env

const connectionString = MONGO_DB_URI

mongoose.connect(connectionString, {
  dbName: NODE_ENV === 'test' ? 'top-lector-db-test' : 'top-lector-db'
})
  .then(() => {
    console.log('MongoDB connected')
  })
  .catch((error) => {
    console.log(error)
  })
