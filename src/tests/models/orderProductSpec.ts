import { ProductStore } from '../../models/product'
import { UserStore } from '../../models/user'
import { OrderStore } from '../../models/order'
import { OrderProductStore } from '../../models/orderProduct'

const productStore = new ProductStore()
const userStore = new UserStore()
const orderStore = new OrderStore()
const orderProductStore = new OrderProductStore()

describe('OrderProduct Model', () => {
  it('should have an index method', () => {
    expect(orderProductStore.index).toBeDefined()
  })

  it('should have a show method', () => {
    expect(orderProductStore.show).toBeDefined()
  })

  it('should have a create method', () => {
    expect(orderProductStore.create).toBeDefined()
  })

  it('should have an update method', () => {
    expect(orderProductStore.update).toBeDefined()
  })

  it('should have a delete method', () => {
    expect(orderProductStore.delete).toBeDefined()
  })

  it('create method should add an order product', async () => {
    const user = await userStore.create({
      first_name: 'OrderProduct',
      last_name: 'Create',
      password: 'password123'
    })

    const product = await productStore.create({
      name: 'Order Product Create',
      price: 100,
      category: 'order-products'
    })

    const order = await orderStore.create({
      user_id: user.id as number,
      status: 'active'
    })

    const result = await orderProductStore.create({
      quantity: 2,
      order_id: order.id as number,
      product_id: product.id as number
    })

    expect(result.quantity).toEqual(2)
    expect(Number(result.order_id)).toEqual(order.id as number)
    expect(Number(result.product_id)).toEqual(product.id as number)
  })

  it('index method should return order products', async () => {
    const result = await orderProductStore.index()
    expect(result.length).toBeGreaterThan(0)
  })

  it('show method should return an order product', async () => {
    const user = await userStore.create({
      first_name: 'OrderProduct',
      last_name: 'Show',
      password: 'password123'
    })

    const product = await productStore.create({
      name: 'Order Product Show',
      price: 100,
      category: 'order-products'
    })

    const order = await orderStore.create({
      user_id: user.id as number,
      status: 'active'
    })

    const created = await orderProductStore.create({
      quantity: 3,
      order_id: order.id as number,
      product_id: product.id as number
    })

    const result = await orderProductStore.show(created.id as unknown as string)
    expect(result.id).toEqual(created.id)
    expect(result.quantity).toEqual(3)
  })

  it('update method should update an order product', async () => {
    const user = await userStore.create({
      first_name: 'OrderProduct',
      last_name: 'Update',
      password: 'password123'
    })

    const product = await productStore.create({
      name: 'Order Product Update',
      price: 100,
      category: 'order-products'
    })

    const order = await orderStore.create({
      user_id: user.id as number,
      status: 'active'
    })

    const created = await orderProductStore.create({
      quantity: 4,
      order_id: order.id as number,
      product_id: product.id as number
    })

    const result = await orderProductStore.update({
      id: created.id,
      quantity: 8,
      order_id: order.id as number,
      product_id: product.id as number
    })

    expect(result.quantity).toEqual(8)
  })

  it('delete method should remove an order product', async () => {
    const user = await userStore.create({
      first_name: 'OrderProduct',
      last_name: 'Delete',
      password: 'password123'
    })

    const product = await productStore.create({
      name: 'Order Product Delete',
      price: 100,
      category: 'order-products'
    })

    const order = await orderStore.create({
      user_id: user.id as number,
      status: 'active'
    })

    const created = await orderProductStore.create({
      quantity: 5,
      order_id: order.id as number,
      product_id: product.id as number
    })

    const result = await orderProductStore.delete(created.id as unknown as string)
    expect(result.quantity).toEqual(5)
  })
})
