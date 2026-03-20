import { db } from "../config/db";

export const initializeDatabase = (): void => {
  db.serialize(() => {
    db.run(
      `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,
      (error) => {
        if (error) {
          console.error("Error creating users table:", error.message);
        } else {
          console.log("Users table ready.");
        }
      },
    );

    db.run(
      `
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        image TEXT,
        category TEXT,
        stock INTEGER NOT NULL DEFAULT 0,
        is_featured INTEGER NOT NULL DEFAULT 0,
        is_best_seller INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,
      (error) => {
        if (error) {
          console.error("Error creating products table:", error.message);
        } else {
          console.log("Products table ready.");
        }
      },
    );

    db.run(
      `
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_address TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      total_price REAL NOT NULL,
      status TEXT DEFAULT 'new',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
      `,
      (error) => {
        if (error) {
          console.error("Error creating orders table:", error.message);
        } else {
          console.log("Orders table ready.");
        }
      },
    );

    db.run(
      `
        CREATE TABLE IF NOT EXISTS order_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          product_title TEXT NOT NULL,
          price REAL NOT NULL,
          quantity INTEGER NOT NULL,
          FOREIGN KEY(order_id) REFERENCES orders(id),
          FOREIGN KEY(product_id) REFERENCES products(id)
        ) 
      `,
      (error) => {
        if (error) {
          console.error("Error creating order_items table:", error.message);
        } else {
          console.log("Order items table ready.");
        }
      },
    );

    db.run(
      `
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(product_id) REFERENCES products(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
      `,
      (error) => {
        if (error) {
          console.error("Error creating reviews table:", error.message);
        } else {
          console.log("Reviews table ready.");
        }
      },
    );
  });
};
