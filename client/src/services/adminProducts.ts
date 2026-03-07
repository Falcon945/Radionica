const API_BASE_URL = "http://localhost:5000/api/products";

type CreateProductPayload = {
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  is_featured: number;
  is_best_seller: number;
};

export const addProduct = async (
  product: CreateProductPayload,
  token: string
): Promise<unknown> => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(product)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add product.");
  }

  return data;
};

export const getAllProductsAdmin = async (): Promise<any[]> => {
  const response = await fetch(API_BASE_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch products.");
  }

  return response.json();
};

export const deleteProduct = async (
  productId: number,
  token: string
): Promise<unknown> => {
  const response = await fetch(`${API_BASE_URL}/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete product.");
  }

  return data;
};

type UpdateProductPayload = {
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  is_featured?: number;
  is_best_seller?: number;
};

export const updateProduct = async (
  productId: number,
  product: UpdateProductPayload,
  token: string
): Promise<unknown> => {
  const response = await fetch(`${API_BASE_URL}/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(product)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update product.");
  }

  return data;
};