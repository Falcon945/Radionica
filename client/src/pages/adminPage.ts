import type { Product } from "../types/Product.js";
import { renderAdminProductsList } from "../components/adminProducts.js";

export const renderAdminPage = (
  products: Product[] = [],
  editingProductId: number | null = null
): string => {
  const editingProduct =
    editingProductId !== null
      ? products.find((product) => product.id === editingProductId) || null
      : null;

  return `
    <main class="admin-page">
      <h1>Admin Dashboard</h1>

      <form id="add-product-form" class="admin-form">
        <input
          name="title"
          placeholder="Product title"
          required
          value="${editingProduct?.title || ""}"
        />

        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          required
          value="${editingProduct?.price ?? ""}"
        />

        <input
          name="stock"
          type="number"
          min="0"
          placeholder="Stock"
          required
          value="${editingProduct?.stock ?? 0}"
        />

        <input
          name="category"
          placeholder="Category"
          value="${editingProduct?.category || ""}"
        />

        <input
          name="image"
          placeholder="Image URL"
          value="${editingProduct?.image || ""}"
        />

        <textarea
          name="description"
          placeholder="Description"
          required
        >${editingProduct?.description || ""}</textarea>

        <div class="admin-checkboxes">
          <label>
            <input
              type="checkbox"
              name="is_featured"
              ${editingProduct?.is_featured ? "checked" : ""}
            />
            Featured
          </label>

          <label>
            <input
              type="checkbox"
              name="is_best_seller"
              ${editingProduct?.is_best_seller ? "checked" : ""}
            />
            Best seller
          </label>
        </div>

        <button type="submit">
          ${editingProduct ? "Update product" : "Add product"}
        </button>

        ${
          editingProduct
            ? `<button type="button" id="cancel-edit-btn" class="secondary-btn">Cancel edit</button>`
            : ""
        }
      </form>

      <p id="admin-message" class="form-message"></p>

      <div id="admin-products">
        ${renderAdminProductsList(products)}
      </div>
    </main>
  `;
};