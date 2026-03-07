import { Request, Response } from "express";
import {
  createProduct,
  deleteProductById,
  getAllProducts,
  getBestSellerProducts,
  getFeaturedProducts,
  getProductById,
  updateProductById
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

export const addProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      price,
      image,
      category,
      stock,
      is_featured,
      is_best_seller
    } = req.body;

    if (!title || !description || price === undefined) {
      res.status(400).json({
        message: "Title, description, and price are required."
      });
      return;
    }

    const productId = await createProduct({
      title,
      description,
      price: Number(price),
      image,
      category,
      stock: Number(stock ?? 0),
      is_featured: Number(is_featured ?? 0),
      is_best_seller: Number(is_best_seller ?? 0)
    });

    res.status(201).json({
      message: "Product created successfully.",
      productId
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Failed to create product." });
  }
};

export const fetchProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = Number(req.params.id);

    if (Number.isNaN(productId)) {
      res.status(400).json({ message: "Invalid product id." });
      return;
    }

    const product = await getProductById(productId);

    if (!product) {
      res.status(404).json({ message: "Product not found." });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by id:", error);
    res.status(500).json({ message: "Failed to fetch product." });
  }
};

export const editProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = Number(req.params.id);

    if (Number.isNaN(productId)) {
      res.status(400).json({ message: "Invalid product id." });
      return;
    }

    const {
      title,
      description,
      price,
      image,
      category,
      stock,
      is_featured,
      is_best_seller
    } = req.body;

    if (!title || !description || price === undefined) {
      res.status(400).json({
        message: "Title, description, and price are required."
      });
      return;
    }

    await updateProductById(productId, {
      title,
      description,
      price: Number(price),
      image,
      category,
      stock: Number(stock ?? 0),
      is_featured: Number(is_featured ?? 0),
      is_best_seller: Number(is_best_seller ?? 0)
    });

    res.status(200).json({
      message: "Product updated successfully."
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product." });
  }
};

export const removeProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = Number(req.params.id);

    if (Number.isNaN(productId)) {
      res.status(400).json({ message: "Invalid product id." });
      return;
    }

    await deleteProductById(productId);

    res.status(200).json({
      message: "Product deleted successfully."
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product." });
  }
};