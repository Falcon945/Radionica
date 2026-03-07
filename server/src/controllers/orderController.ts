import { Request, Response } from "express";
import {
  createOrder,
  getAllOrders,
  getOrdersByUserId,
  updateOrderStatus
} from "../models/orderModel";

export const createNewOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const {
      customerName,
      customerEmail,
      customerAddress,
      customerPhone,
      totalPrice,
      items
    } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized." });
      return;
    }

    if (
      !customerName ||
      !customerEmail ||
      !customerAddress ||
      !customerPhone ||
      !totalPrice ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      res.status(400).json({ message: "Missing required order data." });
      return;
    }

    const orderId = await createOrder({
      userId,
      customerName,
      customerEmail,
      customerAddress,
      customerPhone,
      totalPrice: Number(totalPrice),
      items: items.map((item) => ({
        productId: Number(item.productId),
        productTitle: String(item.productTitle),
        price: Number(item.price),
        quantity: Number(item.quantity)
      }))
    });

    res.status(201).json({
      message: "Order created successfully.",
      orderId
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order." });
  }
};

export const fetchMyOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized." });
      return;
    }

    const orders = await getOrdersByUserId(userId);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Failed to fetch user orders." });
  }
};

export const fetchAllOrders = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};

export const changeOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = Number(req.params.id);
    const { status } = req.body;

    if (Number.isNaN(orderId)) {
      res.status(400).json({ message: "Invalid order id." });
      return;
    }

    if (!status || !["new", "shipped"].includes(status)) {
      res.status(400).json({ message: "Invalid order status." });
      return;
    }

    await updateOrderStatus(orderId, status);

    res.status(200).json({
      message: "Order status updated successfully."
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status." });
  }
};