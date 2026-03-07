import type { Product } from "../types/Product.js";

export const renderAdminProductsList = (products: Product[]): string => {
  if (products.length === 0) {
    return `<p>Nema proizvoda u bazi.</p>`;
  }

  return `
    <section class="admin-products-section">
      <h2>Svi proizvodi</h2>
      <div class="admin-products-list">
        ${products
          .map(
            (product) => `
              <article class="admin-product-item">
                <div class="admin-product-info">
                  <h3>${product.title}</h3>
                  <p>${product.description}</p>
                  <span>Kategorija: ${product.category || "N/A"}</span>
                  <span>Stock: ${product.stock}</span>
                  <span>Featured: ${product.is_featured ? "Yes" : "No"}</span>
                  <span>Best seller: ${product.is_best_seller ? "Yes" : "No"}</span>
                  <strong>$${product.price.toFixed(2)}</strong>
                </div>

                <div class="admin-product-actions">
                  <button
                    type="button"
                    class="edit-btn"
                    data-product-id="${product.id}"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    class="delete-btn"
                    data-product-id="${product.id}"
                  >
                    Delete
                  </button>
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
};