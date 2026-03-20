const API_BASE_URL = "http://localhost:5000/api";

export const getProductReviews = async (productId: number) => {
  const response = await fetch(`${API_BASE_URL}/reviews/product/${productId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product reviews.");
  }

  return response.json();
};

export const addReview = async (review: any, token: string) => {
  const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(review),
  });

  if (!response.ok) {
    throw new Error("Failed to add review.");
  }

  return response.json();
};
