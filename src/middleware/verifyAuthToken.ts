import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const verifyAuthToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authorizationHeader = req.headers.authorization

    if (!authorizationHeader) {
      res.status(401).json('Access denied, token missing')
      return
    }

    const token = authorizationHeader.split(' ')[1]
    jwt.verify(token, process.env.TOKEN_SECRET as string)

    next()
  } catch (err) {
    res.status(401).json('Invalid token')
  }
}

export default verifyAuthToken
