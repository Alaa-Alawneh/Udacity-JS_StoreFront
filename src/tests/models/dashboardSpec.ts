import { ProductStore } from '../../models/product'
import { UserStore } from '../../models/user'
import { OrderStore } from '../../models/order'
import { DashboardStore } from '../../models/dashboard'

const productStore = new ProductStore()
const userStore = new UserStore()
const orderStore = new OrderStore()
const dashboardStore = new DashboardStore()

describe('Dashboard Model', () => {
  it('should have a popularProducts method', () => {
    expect(dashboardStore.popularProducts).toBeDefined()
  })

  it('popularProducts method should return popular products', async () => {
    const user = await userStore.create({
      first_name: 'Popular',
      last_name: 'User',
      password: 'password123'
    })

    const product = await productStore.create({
      name: 'Popular Product',
      price: 100,
      category: 'popular'
    })

    const order = await orderStore.create({
      user_id: user.id as number,
      status: 'complete'
    })

    await orderStore.addProduct(
      5,
      order.id as unknown as string,
      product.id as unknown as string
    )

    const result = await dashboardStore.popularProducts()
    expect(result.length).toBeGreaterThan(0)
  })
})
