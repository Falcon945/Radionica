import { createOrder } from "../services/orders.js";
import {
  clearCart,
  getCart,
  getCartTotal,
  removeCartItem
} from "../utils/cart.js";
import { getToken } from "../utils/storage.js";

type AttachCartEventsParams = {
  renderPage: () => Promise<void>;
};

export const attachCartEvents = ({
  renderPage
}: AttachCartEventsParams): void => {
  const removeButtons = document.querySelectorAll<HTMLButtonElement>(".cart-remove-btn");
  const clearCartButton = document.getElementById("clear-cart-btn");
  const checkoutForm = document.getElementById("checkout-form") as HTMLFormElement | null;
  const checkoutMessage = document.getElementById("checkout-message");

  removeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number(button.dataset.cartId);
      removeCartItem(productId);
      renderPage();
    });
  });

  clearCartButton?.addEventListener("click", () => {
    clearCart();
    renderPage();
  });

  checkoutForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = getToken();
    const cartItems = getCart();

    if (!token) {
      if (checkoutMessage) {
        checkoutMessage.textContent = "Moraš biti ulogovan.";
      }
      return;
    }

    if (cartItems.length === 0) {
      if (checkoutMessage) {
        checkoutMessage.textContent = "Korpa je prazna.";
      }
      return;
    }

    const formData = new FormData(checkoutForm);

    const payload = {
      customerName: String(formData.get("customerName") || "").trim(),
      customerEmail: String(formData.get("customerEmail") || "").trim(),
      customerAddress: String(formData.get("customerAddress") || "").trim(),
      customerPhone: String(formData.get("customerPhone") || "").trim(),
      totalPrice: getCartTotal(),
      items: cartItems.map((item) => ({
        productId: item.id,
        productTitle: item.title,
        price: item.price,
        quantity: item.quantity
      }))
    };

    try {
      await createOrder(payload, token);

      if (checkoutMessage) {
        checkoutMessage.textContent = "Porudžbina uspešno poslata.";
      }

      clearCart();
      checkoutForm.reset();
      renderPage();
    } catch (error) {
      if (checkoutMessage) {
        checkoutMessage.textContent =
          error instanceof Error ? error.message : "Greška pri slanju porudžbine.";
      }
    }
  });
};