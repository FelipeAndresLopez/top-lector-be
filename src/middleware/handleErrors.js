export const handleErrors = (err, req, res, next) => {
  console.error(err)
  if (err.name === 'ValidationError') {
    return res
      .status(400)
      .json({ error: err.message })
  }
  if (err.name === 'JsonWebTokenError') {
    return res
      .status(401)
      .json({ error: 'invalid token' })
  }
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  next(err)
}
