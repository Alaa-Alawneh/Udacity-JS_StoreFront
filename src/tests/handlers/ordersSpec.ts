import supertest from 'supertest'
import app from '../../server'

const request = supertest(app)

let token = ''
let userId = 0
let productId = 0
let orderId = 0
let completedOrderId = 0
let deleteOrderId = 0

describe('Orders Endpoints', () => {
  beforeAll(async () => {
    const userResponse = await request
      .post('/users')
      .send({
        first_name: 'OrderEndpoint',
        last_name: 'User',
        password: 'password123'
      })

    token = userResponse.body.token
    userId = userResponse.body.user.id

    const productResponse = await request
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Order Endpoint Product',
        price: 200,
        category: 'orders'
      })

    productId = productResponse.body.id
  })

  it('POST /orders should require token', async () => {
    const response = await request
      .post('/orders')
      .send({
        user_id: userId,
        status: 'active'
      })

    expect(response.status).toBe(401)
  })

  it('POST /orders should create an order with token', async () => {
    const response = await request
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        user_id: userId,
        status: 'active'
      })

    expect(response.status).toBe(200)
    expect(Number(response.body.user_id)).toBe(userId)
    expect(response.body.status).toBe('active')

    orderId = response.body.id
  })

  it('GET /orders should return orders with token', async () => {
    const response = await request
      .get('/orders')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.length).toBeGreaterThan(0)
  })

  it('GET /orders/:id should return one order with token', async () => {
    const response = await request
      .get(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.id).toBe(orderId)
  })

  it('PUT /orders/:id should update an order with token', async () => {
    const response = await request
      .put(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        user_id: userId,
        status: 'active'
      })

    expect(response.status).toBe(200)
    expect(response.body.id).toBe(orderId)
    expect(response.body.status).toBe('active')
  })

  it('POST /orders/:id/products should add product to order', async () => {
    const response = await request
      .post(`/orders/${orderId}/products`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        quantity: 3,
        product_id: productId
      })

    expect(response.status).toBe(200)
    expect(response.body.quantity).toBe(3)
    expect(Number(response.body.order_id)).toBe(orderId)
    expect(Number(response.body.product_id)).toBe(productId)
  })

  it('GET /users/:id/orders/current should return current order', async () => {
    const response = await request
      .get(`/users/${userId}/orders/current`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.status).toBe('active')
  })

  it('GET /users/:id/orders/completed should return completed orders', async () => {
    const completedResponse = await request
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        user_id: userId,
        status: 'complete'
      })

    completedOrderId = completedResponse.body.id

    const response = await request
      .get(`/users/${userId}/orders/completed`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.length).toBeGreaterThan(0)
    expect(response.body.some((order: { id: number }) => order.id === completedOrderId)).toBeTrue()
  })

  it('DELETE /orders/:id should delete an order with token', async () => {
    const createResponse = await request
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        user_id: userId,
        status: 'active'
      })

    deleteOrderId = createResponse.body.id

    const response = await request
      .delete(`/orders/${deleteOrderId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.id).toBe(deleteOrderId)
  })
})
