import express, { Request, Response, RequestHandler } from 'express'
import productRoutes from './handlers/products'
import userRoutes from './handlers/users'
import orderRoutes from './handlers/orders'
import dashboardRoutes from './handlers/dashboard'

const app: express.Application = express()
const address = '0.0.0.0:3000'

app.use(express.json() as RequestHandler)

app.get('/', function (_req: Request, res: Response) {
  res.send('Storefront Backend API')
})

productRoutes(app)
userRoutes(app)
orderRoutes(app)
dashboardRoutes(app)

if (process.env.ENV !== 'test') {
  app.listen(3000, function () {
    console.log(`starting app on: ${address}`)
  })
}

export default app
