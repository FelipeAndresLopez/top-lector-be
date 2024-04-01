const ERROR_HANDLERS = {
  CastError: ({ res }) => res.status(400).send({ error: 'malformatted id' }),
  JsonWebTokenError: ({ res }) => res
    .status(401)
    .json({ error: 'invalid token' }),
  ValidationError: ({ res, err }) => res
    .status(401)
    .json({ error: err.message }),
  defaultError: ({ res }) => res.status(500).end(),
  TokenExpiredError: ({ res }) => res
    .status(401)
    .json({ error: 'token expired' })
}

export const handleErrors = (err, req, res, next) => {
  console.error('->', err)
  const handler = ERROR_HANDLERS[err.name] || ERROR_HANDLERS.defaultError
  handler({ res, err })
}
