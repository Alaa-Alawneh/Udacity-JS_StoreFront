import client from '../database'

export type PopularProduct = {
  id: number
  name: string
  price: number
  category: string
  total_ordered: string
}

export class DashboardStore {
  async popularProducts(): Promise<PopularProduct[]> {
    try {
      const conn = await client.connect()
      const sql = `
        SELECT products.id, products.name, products.price, products.category, SUM(order_products.quantity) AS total_ordered
        FROM products
        INNER JOIN order_products ON products.id = order_products.product_id
        GROUP BY products.id
        ORDER BY total_ordered DESC
        LIMIT 5
      `
      const result = await conn.query(sql)
      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get popular products. Error: ${err}`)
    }
  }
}
