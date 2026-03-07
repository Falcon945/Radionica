import type { Product } from "../types/Product.js";
import { addToCart } from "../utils/cart.js";

type ProductEventsParams = {
  renderPage: () => Promise<void>;
};

export const attachProductCardEvents = (): void => {
  const productButtons =
    document.querySelectorAll<HTMLButtonElement>(".product-link-btn");

  productButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;

      if (!productId) {
        return;
      }

      window.navigate(`/product/${productId}`);
    });
  });
};

export const attachProductDetailsEvents = (
  product: Product,
  { renderPage }: ProductEventsParams
): void => {
  const addToCartButton = document.getElementById("add-to-cart-btn");
  const message = document.getElementById("product-details-message");

  addToCartButton?.addEventListener("click", () => {
    addToCart(product);

    if (message) {
      message.textContent = "Proizvod dodat u korpu.";
    }

    renderPage();
  });
};

export const attachCarouselProductEvent = (): void => {
  const carouselSlide = document.querySelector<HTMLElement>(".carousel-slide-clickable");

  carouselSlide?.addEventListener("click", () => {
    const productId = carouselSlide.dataset.productId;

    if (!productId) {
      return;
    }

    window.navigate(`/product/${productId}`);
  });
};