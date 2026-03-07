import { db } from "../config/db";
import { decreaseProductStock } from "./productModel";

type CreateOrderParams = {
  userId: number;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerPhone: string;
  totalPrice: number;
  items: {
    productId: number;
    productTitle: string;
    price: number;
    quantity: number;
  }[];
};

export type OrderRow = {
  id: number;
  user_id: number;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  customer_phone: string;
  total_price: number;
  status: string;
  created_at: string;
};

export type OrderItemRow = {
  id: number;
  order_id: number;
  product_id: number;
  product_title: string;
  price: number;
  quantity: number;
};

export type OrderWithItems = {
  id: number;
  user_id: number;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  customer_phone: string;
  total_price: number;
  status: string;
  created_at: string;
  items: OrderItemRow[];
};

export const createOrder = ({
  userId,
  customerName,
  customerEmail,
  customerAddress,
  customerPhone,
  totalPrice,
  items
}: CreateOrderParams): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO orders
      (user_id, customer_name, customer_email, customer_address, customer_phone, total_price, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [userId, customerName, customerEmail, customerAddress, customerPhone, totalPrice, "new"],
      function (orderError) {
        if (orderError) {
          reject(orderError);
          return;
        }

        const orderId = this.lastID;

        if (items.length === 0) {
          resolve(orderId);
          return;
        }

        let completed = 0;
        let failed = false;

        items.forEach((item) => {
          db.run(
            `
            INSERT INTO order_items
            (order_id, product_id, product_title, price, quantity)
            VALUES (?, ?, ?, ?, ?)
            `,
            [orderId, item.productId, item.productTitle, item.price, item.quantity],
            async (itemError) => {
              if (failed) {
                return;
              }

              if (itemError) {
                failed = true;
                reject(itemError);
                return;
              }
              try {
        await decreaseProductStock(item.productId, item.quantity);

        completed += 1;

        if (completed === items.length) {
          resolve(orderId);
        }
      } catch (stockError) {
        failed = true;
        reject(stockError);
      }
            }
          );
        });
      }
    );
  });
};

const getOrderItemsByOrderId = (orderId: number): Promise<OrderItemRow[]> => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT * FROM order_items
      WHERE order_id = ?
      ORDER BY id ASC
      `,
      [orderId],
      (error, rows: OrderItemRow[]) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows || []);
        }
      }
    );
  });
};

export const getOrdersByUserId = async (userId: number): Promise<OrderWithItems[]> => {
  const orders = await new Promise<OrderRow[]>((resolve, reject) => {
    db.all(
      `
      SELECT * FROM orders
      WHERE user_id = ?
      ORDER BY id DESC
      `,
      [userId],
      (error, rows: OrderRow[]) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows || []);
        }
      }
    );
  });

  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const items = await getOrderItemsByOrderId(order.id);
      return { ...order, items };
    })
  );

  return ordersWithItems;
};

export const getAllOrders = async (): Promise<OrderWithItems[]> => {
  const orders = await new Promise<OrderRow[]>((resolve, reject) => {
    db.all(
      `
      SELECT * FROM orders
      ORDER BY id DESC
      `,
      [],
      (error, rows: OrderRow[]) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows || []);
        }
      }
    );
  });

  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const items = await getOrderItemsByOrderId(order.id);
      return { ...order, items };
    })
  );

  return ordersWithItems;
};

export const updateOrderStatus = (orderId: number, status: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(
      `
      UPDATE orders
      SET status = ?
      WHERE id = ?
      `,
      [status, orderId],
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