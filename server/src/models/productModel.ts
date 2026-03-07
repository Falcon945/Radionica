import { db } from "../config/db";

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  is_featured: number;
  is_best_seller: number;
  created_at: string;
};

type CreateProductParams = {
  title: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  stock?: number;
  is_featured?: number;
  is_best_seller?: number;
};

export const getAllProducts = (): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM products ORDER BY id DESC", [], (error, rows: Product[]) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
  });
};

export const getFeaturedProducts = (): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM products WHERE is_featured = 1 ORDER BY id DESC",
      [],
      (error, rows: Product[]) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      }
    );
  });
};

export const getBestSellerProducts = (): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM products WHERE is_best_seller = 1 ORDER BY id DESC LIMIT 3",
      [],
      (error, rows: Product[]) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      }
    );
  });
};

export const createProduct = ({
  title,
  description,
  price,
  image = "",
  category = "",
  stock = 0,
  is_featured = 0,
  is_best_seller = 0
}: CreateProductParams): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO products
      (title, description, price, image, category, stock, is_featured, is_best_seller)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [title, description, price, image, category, stock, is_featured, is_best_seller],
      function (error) {
        if (error) {
          reject(error);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
};

export const deleteProductById = (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM products WHERE id = ?", [id], function (error) {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

export const getProductById = (id: number): Promise<Product | null> => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM products WHERE id = ?",
      [id],
      (error, row: Product) => {
        if (error) {
          reject(error);
        } else {
          resolve(row || null);
        }
      }
    );
  });
};

export const updateProductById = (
  id: number,
  data: {
    title: string;
    description: string;
    price: number;
    image?: string;
    category?: string;
    stock?: number;
    is_featured?: number;
    is_best_seller?: number;
  }
): Promise<void> => {
  const {
    title,
    description,
    price,
    image = "",
    category = "",
    stock = 0,
    is_featured = 0,
    is_best_seller = 0
  } = data;

  return new Promise((resolve, reject) => {
    db.run(
      `
      UPDATE products
      SET
        title = ?,
        description = ?,
        price = ?,
        image = ?,
        category = ?,
        stock = ?,
        is_featured = ?,
        is_best_seller = ?
      WHERE id = ?
      `,
      [
        title,
        description,
        price,
        image,
        category,
        stock,
        is_featured,
        is_best_seller,
        id
      ],
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
};

export const decreaseProductStock = (
  productId: number,
  quantity: number
): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(
      `
      UPDATE products
      SET stock = CASE
        WHEN stock - ? < 0 THEN 0
        ELSE stock - ?
      END
      WHERE id = ?
      `,
      [quantity, quantity, productId],
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
};