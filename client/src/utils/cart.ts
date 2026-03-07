import type { Product } from "../types/Product.js";

export type CartItem = Product & {
  quantity: number;
};

const CART_KEY = "shop_cart";

export const getCart = (): CartItem[] => {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart: CartItem[]): void => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addToCart = (product: Product): void => {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
};

export const removeCartItem = (productId: number): void => {
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
};

export const clearCart = (): void => {
  saveCart([]);
};

export const increaseCartItemQuantity = (productId: number): void => {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);

  if (item) item.quantity += 1;

  saveCart(cart);
};

export const decreaseCartItemQuantity = (productId: number): void => {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);

  if (item && item.quantity > 1) {
    item.quantity -= 1;
  }

  saveCart(cart);
};

export const getCartTotal = (): number => {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const getCartItemsCount = (): number => {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
};