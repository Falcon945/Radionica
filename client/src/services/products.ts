import type { Product } from "../types/Product.js";

const API_BASE_URL = "http://localhost:5000/api/products";

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/featured`);

  if (!response.ok) {
    throw new Error("Failed to fetch featured products.");
  }

  return response.json();
};

export const getBestSellerProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/best-sellers`);

  if (!response.ok) {
    throw new Error("Failed to fetch best seller products.");
  }

  return response.json();
};