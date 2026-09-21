import bcrypt from 'bcrypt'
import client from '../database'

export type User = {
  id?: number
  first_name: string
  last_name: string
  password?: string
  password_digest?: string
}

const pepper = process.env.BCRYPT_PASSWORD as string
const saltRounds = process.env.SALT_ROUNDS as string

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT id, first_name, last_name FROM users'
      const result = await conn.query(sql)
      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`)
    }
  }

  async show(id: string): Promise<User> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT id, first_name, last_name FROM users WHERE id=($1)'
      const result = await conn.query(sql, [id])
      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`)
    }
  }

  async create(user: User): Promise<User> {
    try {
      const hash = bcrypt.hashSync(
        (user.password as string) + pepper,
        parseInt(saltRounds)
      )

      const conn = await client.connect()
      const sql = 'INSERT INTO users (first_name, last_name, password_digest) VALUES($1, $2, $3) RETURNING id, first_name, last_name'
      const result = await conn.query(sql, [user.first_name, user.last_name, hash])
      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not create user ${user.first_name}. Error: ${err}`)
    }
  }

  async update(user: User): Promise<User> {
    try {
      const conn = await client.connect()
      const sql = 'UPDATE users SET first_name=$1, last_name=$2 WHERE id=$3 RETURNING id, first_name, last_name'
      const result = await conn.query(sql, [user.first_name, user.last_name, user.id])
      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not update user ${user.id}. Error: ${err}`)
    }
  }

  async delete(id: string): Promise<User> {
    try {
      const conn = await client.connect()
      const sql = 'DELETE FROM users WHERE id=($1) RETURNING id, first_name, last_name'
      const result = await conn.query(sql, [id])
      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not delete user ${id}. Error: ${err}`)
    }
  }

  async authenticate(firstName: string, password: string): Promise<User | null> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM users WHERE first_name=($1)'
      const result = await conn.query(sql, [firstName])
      conn.release()

      if (result.rows.length) {
        const user = result.rows[0]

        if (bcrypt.compareSync(password + pepper, user.password_digest)) {
          return {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name
          }
        }
      }

      return null
    } catch (err) {
      throw new Error(`Could not authenticate user ${firstName}. Error: ${err}`)
    }
  }
}
