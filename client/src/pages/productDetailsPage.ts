import type { Product } from "../types/Product.js";

export const renderProductDetailsPage = (product: Product): string => {
  return `
    <main class="product-details-page">
      <section class="product-details">
        <div class="product-details-image">
          <img src="${product.image}" alt="${product.title}" />
        </div>

        <div class="product-details-content">
          <span class="product-details-category">
            ${product.category || "N/A"}
          </span>

          <h1>${product.title}</h1>
          <p class="product-details-description">${product.description}</p>

          <p class="product-details-price">$${product.price.toFixed(2)}</p>

          <p class="product-details-stock">
            ${
              product.stock > 0
                ? `Na stanju: ${product.stock}`
                : "Trenutno nema na stanju"
            }
          </p>

          <div class="product-details-actions">
            <button
              type="button"
              id="add-to-cart-btn"
              data-product-id="${product.id}"
              ${product.stock <= 0 ? "disabled" : ""}
            >
              Add to cart
            </button>

            <button
              type="button"
              class="secondary-btn"
              onclick="window.navigate('/products')"
            >
              Nazad na proizvode
            </button>
          </div>

          <p id="product-details-message" class="form-message"></p>
        </div>
      </section>
    </main>
  `;
};