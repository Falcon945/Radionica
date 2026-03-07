import type { Product } from "../types/Product.js";

export const renderProductsPage = (products: Product[]): string => {
  return `
    <main class="products-page">
      <section class="products-hero">
        <h1>Svi proizvodi</h1>
        <p>Pregled celokupne ponude proizvoda.</p>
      </section>

      <section class="products-grid-section">
        <div class="products-grid">
          ${products
            .map(
              (product) => `
                <article class="product-card product-card-clickable">
                  <button
                    type="button"
                    class="product-link-btn"
                    data-product-id="${product.id}"
                  >
                    <img src="${product.image}" alt="${product.title}" />
                    <h3>${product.title}</h3>
                    <p>${product.description}</p>
                    <span>Kategorija: ${product.category || "N/A"}</span>
                    <strong>$${product.price.toFixed(2)}</strong>
                  </button>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    </main>
  `;
};