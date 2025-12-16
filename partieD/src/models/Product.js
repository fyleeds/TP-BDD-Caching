const { readPool, writePool } = require('../config/db');

class Product {

  // 🔍 READS → replica
  static async getAll() {
    const { rows } = await readPool.query('SELECT * FROM products;');
    return rows;
  }

  static async getById(id) {
    const { rows } = await readPool.query(
      'SELECT * FROM products WHERE id = $1;',
      [id]
    );
    return rows[0];
  }

  // ✍️ WRITES → primary
  static async create({ name, price_cents }) {
    const { rows } = await writePool.query(
      'INSERT INTO products(name, price_cents) VALUES($1, $2) RETURNING *;',
      [name, price_cents]
    );
    return rows[0];
  }

  static async update(id, { name, price_cents }) {
    const { rows } = await writePool.query(
      'UPDATE products SET name = $1, price_cents = $2 WHERE id = $3 RETURNING *;',
      [name, price_cents, id]
    );
    return rows[0];
  }

  static async delete(id) {
    const { rows } = await writePool.query(
      'DELETE FROM products WHERE id = $1 RETURNING *;',
      [id]
    );
    return rows[0];
  }
}

module.exports = Product;
