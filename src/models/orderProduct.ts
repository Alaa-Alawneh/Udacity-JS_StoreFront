import client from '../database'

export type OrderProduct = {
  id?: number
  quantity: number
  order_id: number
  product_id: number
}

export class OrderProductStore {
  async index(): Promise<OrderProduct[]> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM order_products'
      const result = await conn.query(sql)
      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get order products. Error: ${err}`)
    }
  }

  async show(id: string): Promise<OrderProduct> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM order_products WHERE id=($1)'
      const result = await conn.query(sql, [id])
      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not find order product ${id}. Error: ${err}`)
    }
  }

  async create(orderProduct: OrderProduct): Promise<OrderProduct> {
    try {
      const conn = await client.connect()
      const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *'
      const result = await conn.query(sql, [
        orderProduct.quantity,
        orderProduct.order_id,
        orderProduct.product_id
      ])
      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not create order product. Error: ${err}`)
    }
  }

  async update(orderProduct: OrderProduct): Promise<OrderProduct> {
    try {
      const conn = await client.connect()
      const sql = 'UPDATE order_products SET quantity=$1, order_id=$2, product_id=$3 WHERE id=$4 RETURNING *'
      const result = await conn.query(sql, [
        orderProduct.quantity,
        orderProduct.order_id,
        orderProduct.product_id,
        orderProduct.id
      ])
      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not update order product ${orderProduct.id}. Error: ${err}`)
    }
  }

  async delete(id: string): Promise<OrderProduct> {
    try {
      const conn = await client.connect()
      const sql = 'DELETE FROM order_products WHERE id=($1) RETURNING *'
      const result = await conn.query(sql, [id])
      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not delete order product ${id}. Error: ${err}`)
    }
  }
}
