const API_BASE_URL = "http://localhost:5000/api/products";

type CreateProductPayload = {
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
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