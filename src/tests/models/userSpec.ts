import { UserStore } from '../../models/user'

const store = new UserStore()

describe('User Model', () => {
  it('should have an index method', () => {
    expect(store.index).toBeDefined()
  })

  it('should have a show method', () => {
    expect(store.show).toBeDefined()
  })

  it('should have a create method', () => {
    expect(store.create).toBeDefined()
  })

  it('should have an authenticate method', () => {
    expect(store.authenticate).toBeDefined()
  })

  it('create method should add a user', async () => {
    const result = await store.create({
      first_name: 'Test',
      last_name: 'User',
      password: 'password123'
    })

    expect(result.first_name).toEqual('Test')
    expect(result.last_name).toEqual('User')
  })

  it('index method should return users', async () => {
    const result = await store.index()
    expect(result.length).toBeGreaterThan(0)
  })

  it('show method should return the correct user', async () => {
    const created = await store.create({
      first_name: 'Show',
      last_name: 'User',
      password: 'password123'
    })

    const result = await store.show(created.id as unknown as string)
    expect(result.first_name).toEqual('Show')
  })

  it('authenticate method should authenticate a valid user', async () => {
    await store.create({
      first_name: 'Auth',
      last_name: 'User',
      password: 'password123'
    })

    const result = await store.authenticate('Auth', 'password123')
    expect(result?.first_name).toEqual('Auth')
  })

  it('authenticate method should reject invalid password', async () => {
    const result = await store.authenticate('Auth', 'wrongpassword')
    expect(result).toBeNull()
  })

  it('update method should update a user', async () => {
    const created = await store.create({
      first_name: 'Old',
      last_name: 'Name',
      password: 'password123'
    })

    const result = await store.update({
      id: created.id,
      first_name: 'New',
      last_name: 'Name'
    })

    expect(result.first_name).toEqual('New')
  })

  it('delete method should remove a user', async () => {
    const created = await store.create({
      first_name: 'Delete',
      last_name: 'User',
      password: 'password123'
    })

    const result = await store.delete(created.id as unknown as string)
    expect(result.first_name).toEqual('Delete')
  })
})
