import { ProductStore } from '../../models/product'

const store = new ProductStore()

describe('Product Model', () => {
  it('should have an index method', () => {
    expect(store.index).toBeDefined()
  })

  it('should have a show method', () => {
    expect(store.show).toBeDefined()
  })

  it('should have a create method', () => {
    expect(store.create).toBeDefined()
  })

  it('should have an update method', () => {
    expect(store.update).toBeDefined()
  })

  it('should have a delete method', () => {
    expect(store.delete).toBeDefined()
  })

  it('create method should add a product', async () => {
    const result = await store.create({
      name: 'Test Product',
      price: 100,
      category: 'test'
    })

    expect(result.name).toEqual('Test Product')
    expect(result.price).toEqual(100)
    expect(result.category).toEqual('test')
  })

  it('index method should return products', async () => {
    const result = await store.index()
    expect(result.length).toBeGreaterThan(0)
  })

  it('show method should return the correct product', async () => {
    const created = await store.create({
      name: 'Show Product',
      price: 200,
      category: 'test'
    })

    const result = await store.show(created.id as unknown as string)
    expect(result.name).toEqual('Show Product')
  })

  it('update method should update a product', async () => {
    const created = await store.create({
      name: 'Old Product',
      price: 300,
      category: 'old'
    })

    const result = await store.update({
      id: created.id,
      name: 'Updated Product',
      price: 350,
      category: 'updated'
    })

    expect(result.name).toEqual('Updated Product')
    expect(result.price).toEqual(350)
    expect(result.category).toEqual('updated')
  })

  it('productsByCategory method should return products by category', async () => {
    await store.create({
      name: 'Category Product',
      price: 400,
      category: 'special'
    })

    const result = await store.productsByCategory('special')
    expect(result.length).toBeGreaterThan(0)
    expect(result[0].category).toEqual('special')
  })

  it('delete method should remove a product', async () => {
    const created = await store.create({
      name: 'Delete Product',
      price: 500,
      category: 'delete'
    })

    const result = await store.delete(created.id as unknown as string)
    expect(result.name).toEqual('Delete Product')
  })
})
