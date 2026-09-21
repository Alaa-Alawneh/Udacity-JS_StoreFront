import supertest from 'supertest'
import app from '../../server'

const request = supertest(app)

let token = ''
let userId = 0
let deleteUserToken = ''
let deleteUserId = 0

describe('Users Endpoints', () => {
  it('POST /users should create a user and return a token', async () => {
    const response = await request
      .post('/users')
      .send({
        first_name: 'Endpoint',
        last_name: 'User',
        password: 'password123'
      })

    expect(response.status).toBe(200)
    expect(response.body.user.first_name).toBe('Endpoint')
    expect(response.body.token).toBeDefined()

    token = response.body.token
    userId = response.body.user.id
  })

  it('GET /users should require token', async () => {
    const response = await request.get('/users')
    expect(response.status).toBe(401)
  })

  it('GET /users should return users with token', async () => {
    const response = await request
      .get('/users')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
  })

  it('GET /users/:id should return one user with token', async () => {
    const response = await request
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.first_name).toBe('Endpoint')
  })

  it('PUT /users/:id should update a user with token', async () => {
    const response = await request
      .put(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        first_name: 'UpdatedEndpoint',
        last_name: 'User'
      })

    expect(response.status).toBe(200)
    expect(response.body.first_name).toBe('UpdatedEndpoint')
    expect(response.body.last_name).toBe('User')
  })

  it('POST /users/authenticate should authenticate user', async () => {
    const response = await request
      .post('/users/authenticate')
      .send({
        first_name: 'UpdatedEndpoint',
        password: 'password123'
      })

    expect(response.status).toBe(200)
    expect(response.body.token).toBeDefined()
  })

  it('DELETE /users/:id should delete a user with token', async () => {
    const createResponse = await request
      .post('/users')
      .send({
        first_name: 'DeleteEndpoint',
        last_name: 'User',
        password: 'password123'
      })

    deleteUserToken = createResponse.body.token
    deleteUserId = createResponse.body.user.id

    const response = await request
      .delete(`/users/${deleteUserId}`)
      .set('Authorization', `Bearer ${deleteUserToken}`)

    expect(response.status).toBe(200)
    expect(response.body.first_name).toBe('DeleteEndpoint')
  })
})
