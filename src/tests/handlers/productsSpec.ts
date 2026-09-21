import supertest from 'supertest'
import app from '../../server'

const request = supertest(app)

let token = ''
let productId = 0
let deleteProductId = 0

describe('Products Endpoints', () => {
  beforeAll(async () => {
    const response = await request
      .post('/users')
      .send({
        first_name: 'Product',
        last_name: 'Tester',
        password: 'password123'
      })

    token = response.body.token
  })

  it('POST /products should require token', async () => {
    const response = await request
      .post('/products')
      .send({
        name: 'No Token Product',
        price: 100,
        category: 'test'
      })

    expect(response.status).toBe(401)
  })

  it('POST /products should create a product with token', async () => {
    const response = await request
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Endpoint Product',
        price: 100,
        category: 'endpoint'
      })

    expect(response.status).toBe(200)
    expect(response.body.name).toBe('Endpoint Product')

    productId = response.body.id
  })

  it('GET /products should return products', async () => {
    const response = await request.get('/products')

    expect(response.status).toBe(200)
    expect(response.body.length).toBeGreaterThan(0)
  })

  it('GET /products/:id should return one product', async () => {
    const response = await request.get(`/products/${productId}`)

    expect(response.status).toBe(200)
    expect(response.body.name).toBe('Endpoint Product')
  })

  it('PUT /products/:id should update a product with token', async () => {
    const response = await request
      .put(`/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Endpoint Product',
        price: 150,
        category: 'updated-endpoint'
      })

    expect(response.status).toBe(200)
    expect(response.body.name).toBe('Updated Endpoint Product')
    expect(response.body.price).toBe(150)
    expect(response.body.category).toBe('updated-endpoint')
  })

  it('GET /products/category/:category should return products by category', async () => {
    const response = await request.get('/products/category/updated-endpoint')

    expect(response.status).toBe(200)
    expect(response.body.length).toBeGreaterThan(0)
  })

  it('DELETE /products/:id should delete a product with token', async () => {
    const productResponse = await request
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Delete Endpoint Product',
        price: 200,
        category: 'delete-endpoint'
      })

    deleteProductId = productResponse.body.id

    const response = await request
      .delete(`/products/${deleteProductId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.name).toBe('Delete Endpoint Product')
  })
})
