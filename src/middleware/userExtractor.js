import jwt from 'jsonwebtoken'

export const userExtractor = (req, res, next) => {
  const authorization = req.headers.authorization
  let token = null

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.split(' ')[1]
  }

  let decodedToken = null

  try {
    decodedToken = jwt.verify(token, process.env.SECRET)
  } catch {}

  if (!token || !decodedToken?.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  const userId = decodedToken?.id
  req.userId = userId

  next()
}
