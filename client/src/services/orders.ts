const API_BASE_URL = "http://localhost:5000/api/orders";

type CheckoutPayload = {
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

export const createOrder = async (
  payload: CheckoutPayload,
  token: string
): Promise<unknown> => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create order.");
  }

  return data;
};

export const getMyOrders = async (token: string): Promise<any[]> => {
  const response = await fetch(`${API_BASE_URL}/my-orders`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch my orders.");
  }

  return data;
};

export const getAllOrdersAdmin = async (token: string): Promise<any[]> => {
  const response = await fetch(API_BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch orders.");
  }

  return data;
};

export const updateOrderStatus = async (
  orderId: number,
  status: "new" | "shipped",
  token: string
): Promise<unknown> => {
  const response = await fetch(`${API_BASE_URL}/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update order status.");
  }

  return data;
};