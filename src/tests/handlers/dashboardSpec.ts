import supertest from 'supertest'
import app from '../../server'

const request = supertest(app)

describe('Dashboard Endpoints', () => {
  it('GET /dashboard/products/popular should return popular products', async () => {
    const response = await request.get('/dashboard/products/popular')

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBeTrue()
  })
})
