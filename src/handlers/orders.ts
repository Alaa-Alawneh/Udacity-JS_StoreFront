import express, { Request, Response } from 'express'
import { Order, OrderStore } from '../models/order'
import verifyAuthToken from '../middleware/verifyAuthToken'

const store = new OrderStore()

const index = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await store.index()
    res.json(orders)
  } catch (err) {
    res.status(400).json(err)
  }
}

const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await store.show(req.params.id)
    res.json(order)
  } catch (err) {
    res.status(400).json(err)
  }
}

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const order: Order = {
      user_id: req.body.user_id,
      status: req.body.status
    }

    const newOrder = await store.create(order)
    res.json(newOrder)
  } catch (err) {
    res.status(400).json(err)
  }
}

const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const order: Order = {
      id: parseInt(req.params.id),
      user_id: req.body.user_id,
      status: req.body.status
    }

    const updatedOrder = await store.update(order)
    res.json(updatedOrder)
  } catch (err) {
    res.status(400).json(err)
  }
}

const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedOrder = await store.delete(req.params.id)
    res.json(deletedOrder)
  } catch (err) {
    res.status(400).json(err)
  }
}

const addProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const quantity = parseInt(req.body.quantity)
    const orderId = req.params.id
    const productId = req.body.product_id

    const addedProduct = await store.addProduct(quantity, orderId, productId)
    res.json(addedProduct)
  } catch (err) {
    res.status(400).json(err)
  }
}

const currentOrderByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await store.currentOrderByUser(req.params.id)
    res.json(order)
  } catch (err) {
    res.status(400).json(err)
  }
}

const completedOrdersByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await store.completedOrdersByUser(req.params.id)
    res.json(orders)
  } catch (err) {
    res.status(400).json(err)
  }
}

const orderRoutes = (app: express.Application): void => {
  app.get('/orders', verifyAuthToken, index)
  app.get('/orders/:id', verifyAuthToken, show)
  app.post('/orders', verifyAuthToken, create)
  app.put('/orders/:id', verifyAuthToken, update)
  app.delete('/orders/:id', verifyAuthToken, destroy)
  app.post('/orders/:id/products', verifyAuthToken, addProduct)
  app.get('/users/:id/orders/current', verifyAuthToken, currentOrderByUser)
  app.get('/users/:id/orders/completed', verifyAuthToken, completedOrdersByUser)
}

export default orderRoutes
