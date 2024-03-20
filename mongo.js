import mongoose from 'mongoose'

const connectionString = process.env.MONGO_DB_URI

mongoose.connect(connectionString, {
  dbName: 'top-lector-db'
})
  .then(() => {
    console.log('MongoDB connected')
  })
  .catch((error) => {
    console.log(error)
  })
