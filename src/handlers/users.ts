import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User, UserStore } from '../models/user'
import verifyAuthToken from '../middleware/verifyAuthToken'

const store = new UserStore()

const createToken = (user: User): string => {
  return jwt.sign({ user }, process.env.TOKEN_SECRET as string)
}

const index = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await store.index()
    res.json(users)
  } catch (err) {
    res.status(400).json(err)
  }
}

const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await store.show(req.params.id)
    res.json(user)
  } catch (err) {
    res.status(400).json(err)
  }
}

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const user: User = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: req.body.password
    }

    const newUser = await store.create(user)
    const token = createToken(newUser)

    res.json({
      user: newUser,
      token
    })
  } catch (err) {
    res.status(400).json(err)
  }
}

const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const user: User = {
      id: parseInt(req.params.id),
      first_name: req.body.first_name,
      last_name: req.body.last_name
    }

    const updatedUser = await store.update(user)
    res.json(updatedUser)
  } catch (err) {
    res.status(400).json(err)
  }
}

const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedUser = await store.delete(req.params.id)
    res.json(deletedUser)
  } catch (err) {
    res.status(400).json(err)
  }
}

const authenticate = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await store.authenticate(req.body.first_name, req.body.password)

    if (!user) {
      res.status(401).json('Invalid username or password')
      return
    }

    const token = createToken(user)

    res.json({
      user,
      token
    })
  } catch (err) {
    res.status(400).json(err)
  }
}

const userRoutes = (app: express.Application): void => {
  app.get('/users', verifyAuthToken, index)
  app.get('/users/:id', verifyAuthToken, show)
  app.post('/users', create)
  app.put('/users/:id', verifyAuthToken, update)
  app.delete('/users/:id', verifyAuthToken, destroy)
  app.post('/users/authenticate', authenticate)
}

export default userRoutes
