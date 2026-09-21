import { ProductStore } from '../../models/product'
import { UserStore } from '../../models/user'
import { OrderStore } from '../../models/order'

const productStore = new ProductStore()
const userStore = new UserStore()
const orderStore = new OrderStore()

describe('Order Model', () => {
  it('should have an index method', () => {
    expect(orderStore.index).toBeDefined()
  })

  it('should have a show method', () => {
    expect(orderStore.show).toBeDefined()
  })

  it('should have a create method', () => {
    expect(orderStore.create).toBeDefined()
  })

  it('should have an update method', () => {
    expect(orderStore.update).toBeDefined()
  })

  it('should have a delete method', () => {
    expect(orderStore.delete).toBeDefined()
  })

  it('should have an addProduct method', () => {
    expect(orderStore.addProduct).toBeDefined()
  })

  it('create method should create an order', async () => {
    const user = await userStore.create({
      first_name: 'Order',
      last_name: 'User',
      password: 'password123'
    })

    const result = await orderStore.create({
      user_id: user.id as number,
      status: 'active'
    })

    expect(Number(result.user_id)).toEqual(user.id as number)
    expect(result.status).toEqual('active')
  })

  it('index method should return orders', async () => {
    const user = await userStore.create({
      first_name: 'IndexOrder',
      last_name: 'User',
      password: 'password123'
    })

    await orderStore.create({
      user_id: user.id as number,
      status: 'active'
    })

    const result = await orderStore.index()
    expect(result.length).toBeGreaterThan(0)
  })

  it('show method should return an order', async () => {
    const user = await userStore.create({
      first_name: 'ShowOrder',
      last_name: 'User',
      password: 'password123'
    })

    const order = await orderStore.create({
      user_id: user.id as number,
      status: 'active'
    })

    const result = await orderStore.show(order.id as unknown as string)
    expect(result.id).toEqual(order.id)
  })

  it('update method should update an order', async () => {
    const user = await userStore.create({
      first_name: 'UpdateOrder',
      last_name: 'User',
      password: 'password123'
    })

    const order = await orderStore.create({
      user_id: user.id as number,
      status: 'active'
    })

    const result = await orderStore.update({
      id: order.id,
      user_id: user.id as number,
      status: 'complete'
    })

    expect(result.id).toEqual(order.id)
    expect(result.status).toEqual('complete')
  })

  it('delete method should remove an order', async () => {
    const user = await userStore.create({
      first_name: 'DeleteOrder',
      last_name: 'User',
      password: 'password123'
    })

    const order = await orderStore.create({
      user_id: user.id as number,
      status: 'active'
    })

    const result = await orderStore.delete(order.id as unknown as string)
    expect(result.id).toEqual(order.id)
  })

  it('addProduct method should add a product to an order', async () => {
    const user = await userStore.create({
      first_name: 'Cart',
      last_name: 'User',
      password: 'password123'
    })

    const product = await productStore.create({
      name: 'Cart Product',
      price: 100,
      category: 'cart'
    })

    const order = await orderStore.create({
      user_id: user.id as number,
      status: 'active'
    })

    const result = await orderStore.addProduct(
      2,
      order.id as unknown as string,
      product.id as unknown as string
    )

    expect(result.quantity).toEqual(2)
    expect(Number(result.order_id)).toEqual(order.id as number)
    expect(Number(result.product_id)).toEqual(product.id as number)
  })

  it('currentOrderByUser method should return active order', async () => {
    const user = await userStore.create({
      first_name: 'Current',
      last_name: 'User',
      password: 'password123'
    })

    await orderStore.create({
      user_id: user.id as number,
      status: 'active'
    })

    const result = await orderStore.currentOrderByUser(user.id as unknown as string)
    expect(result.status).toEqual('active')
  })

  it('completedOrdersByUser method should return completed orders', async () => {
    const user = await userStore.create({
      first_name: 'Complete',
      last_name: 'User',
      password: 'password123'
    })

    await orderStore.create({
      user_id: user.id as number,
      status: 'complete'
    })

    const result = await orderStore.completedOrdersByUser(user.id as unknown as string)
    expect(result.length).toBeGreaterThan(0)
    expect(result[0].status).toEqual('complete')
  })
})
