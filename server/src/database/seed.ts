import bcrypt from "bcrypt";
import { db } from "../config/db";

export const seedDatabase = async (): Promise<void> => {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    db.get(
      "SELECT * FROM users WHERE email = ?",
      ["admin@shop.com"],
      (userError, userRow) => {
        if (userError) {
          console.error("Error checking admin user:", userError.message);
          return;
        }

        if (!userRow) {
          db.run(
            `
            INSERT INTO users (name, email, password, role)
            VALUES (?, ?, ?, ?)
            `,
            ["Admin", "admin@shop.com", hashedPassword, "admin"],
            (insertError) => {
              if (insertError) {
                console.error("Error inserting admin user:", insertError.message);
              } else {
                console.log("Admin user seeded.");
              }
            }
          );
        } else {
          console.log("Admin user already exists.");
        }
      }
    );

    const sampleProducts = [
      {
        title: "Wireless Headphones",
        description: "Comfortable wireless headphones with clear sound.",
        price: 79.99,
        image: "https://via.placeholder.com/300x200?text=Headphones",
        category: "Audio",
        stock: 12,
        is_featured: 1,
        is_best_seller: 1
      },
      {
        title: "Gaming Mouse",
        description: "Fast and precise gaming mouse for everyday use.",
        price: 39.99,
        image: "https://via.placeholder.com/300x200?text=Mouse",
        category: "Accessories",
        stock: 20,
        is_featured: 1,
        is_best_seller: 1
      },
      {
        title: "Mechanical Keyboard",
        description: "Compact mechanical keyboard with RGB lighting.",
        price: 89.99,
        image: "https://via.placeholder.com/300x200?text=Keyboard",
        category: "Accessories",
        stock: 15,
        is_featured: 1,
        is_best_seller: 1
      },
      {
        title: "27 Inch Monitor",
        description: "Sharp display for work and entertainment.",
        price: 199.99,
        image: "https://via.placeholder.com/300x200?text=Monitor",
        category: "Displays",
        stock: 8,
        is_featured: 0,
        is_best_seller: 0
      },
      {
        title: "USB-C Hub",
        description: "Useful hub with multiple ports for modern devices.",
        price: 29.99,
        image: "https://via.placeholder.com/300x200?text=USB-C+Hub",
        category: "Accessories",
        stock: 30,
        is_featured: 0,
        is_best_seller: 0
      }
    ];

    sampleProducts.forEach((product) => {
      db.get(
        "SELECT * FROM products WHERE title = ?",
        [product.title],
        (productError, productRow) => {
          if (productError) {
            console.error("Error checking product:", productError.message);
            return;
          }

          if (!productRow) {
            db.run(
              `
              INSERT INTO products
              (title, description, price, image, category, stock, is_featured, is_best_seller)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
              `,
              [
                product.title,
                product.description,
                product.price,
                product.image,
                product.category,
                product.stock,
                product.is_featured,
                product.is_best_seller
              ],
              (insertError) => {
                if (insertError) {
                  console.error(`Error inserting product ${product.title}:`, insertError.message);
                } else {
                  console.log(`Product seeded: ${product.title}`);
                }
              }
            );
          } else {
            console.log(`Product already exists: ${product.title}`);
          }
        }
      );
    });
  } catch (error) {
    console.error("Seed error:", error);
  }
};