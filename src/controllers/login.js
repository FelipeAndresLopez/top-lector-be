import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

export class LoginController {
  constructor ({ userModel }) {
    this.model = userModel
  }

  login = async (req, res, next) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    const isPasswordCorrect = user === null
      ? false
      : await bcrypt.compare(password, user.password)

    if (!(user && isPasswordCorrect)) {
      return res.status(401).json({
        error: 'invalid username or password'
      })
    }

    const userForToken = {
      email: user.email,
      id: user._id
    }

    const token = jwt.sign(
      userForToken,
      process.env.SECRET
    )

    res.send({
      name: user.name,
      email: user.email,
      token
    })
  }
}
