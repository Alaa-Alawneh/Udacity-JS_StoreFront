import express, { Request, Response } from 'express'
import { DashboardStore } from '../models/dashboard'

const store = new DashboardStore()

const popularProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await store.popularProducts()
    res.json(products)
  } catch (err) {
    res.status(400).json(err)
  }
}

const dashboardRoutes = (app: express.Application): void => {
  app.get('/dashboard/products/popular', popularProducts)
}

export default dashboardRoutes
