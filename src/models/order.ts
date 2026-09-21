import client from '../database'

export type Order = {
  id?: number
  user_id: number
  status: string
}

export type OrderProduct = {
  id?: number
  quantity: number
  order_id: number
  product_id: number
}

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM orders'
      const result = await conn.query(sql)
      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`)
    }
  }

  async show(id: string): Promise<Order> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM orders WHERE id=($1)'
      const result = await conn.query(sql, [id])
      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not find order ${id}. Error: ${err}`)
    }
  }

  async create(order: Order): Promise<Order> {
    try {
      const conn = await client.connect()
      const sql = 'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *'
      const result = await conn.query(sql, [order.user_id, order.status])
      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not create order for user ${order.user_id}. Error: ${err}`)
    }
  }

  async update(order: Order): Promise<Order> {
    try {
      const conn = await client.connect()
      const sql = 'UPDATE orders SET user_id=$1, status=$2 WHERE id=$3 RETURNING *'
      const result = await conn.query(sql, [order.user_id, order.status, order.id])
      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not update order ${order.id}. Error: ${err}`)
    }
  }

  async delete(id: string): Promise<Order> {
    try {
      const conn = await client.connect()
      const sql = 'DELETE FROM orders WHERE id=($1) RETURNING *'
      const result = await conn.query(sql, [id])
      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not delete order ${id}. Error: ${err}`)
    }
  }

  async addProduct(quantity: number, orderId: string, productId: string): Promise<OrderProduct> {
    try {
      const conn = await client.connect()
      const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *'
      const result = await conn.query(sql, [quantity, orderId, productId])
      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not add product ${productId} to order ${orderId}. Error: ${err}`)
    }
  }

  async currentOrderByUser(userId: string): Promise<Order> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM orders WHERE user_id=($1) AND status=($2)'
      const result = await conn.query(sql, [userId, 'active'])
      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not get current order for user ${userId}. Error: ${err}`)
    }
  }

  async completedOrdersByUser(userId: string): Promise<Order[]> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM orders WHERE user_id=($1) AND status=($2)'
      const result = await conn.query(sql, [userId, 'complete'])
      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get completed orders for user ${userId}. Error: ${err}`)
    }
  }
}
