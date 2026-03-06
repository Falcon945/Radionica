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