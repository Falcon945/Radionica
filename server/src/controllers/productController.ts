import { Request, Response } from "express";
import {
  getAllProducts,
  getFeaturedProducts,
  getBestSellerProducts
} from "../models/productModel";

export const fetchAllProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({ message: "Failed to fetch products." });
  }
};

export const fetchFeaturedProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await getFeaturedProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({ message: "Failed to fetch featured products." });
  }
};

export const fetchBestSellerProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await getBestSellerProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching best seller products:", error);
    res.status(500).json({ message: "Failed to fetch best seller products." });
  }
};