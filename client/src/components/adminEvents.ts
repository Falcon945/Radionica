import { addProduct, deleteProduct, updateProduct } from "../services/adminProducts.js";
import { getToken } from "../utils/storage.js";

type AdminEventHandlersParams = {
  editingProductId: number | null;
  setEditingProductId: (id: number | null) => void;
  renderPage: () => Promise<void>;
};

export const attachAdminDeleteEvents = ({
  renderPage
}: Pick<AdminEventHandlersParams, "renderPage">): void => {
  const deleteButtons = document.querySelectorAll<HTMLButtonElement>(".delete-btn");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const token = getToken();
      const productId = Number(button.dataset.productId);

      if (!token) {
        alert("Missing token. Login as admin.");
        return;
      }

      if (!productId) {
        return;
      }

      const confirmed = window.confirm("Da li sigurno želiš da obrišeš proizvod?");
      if (!confirmed) {
        return;
      }

      try {
        await deleteProduct(productId, token);
        await renderPage();
      } catch (error) {
        alert(error instanceof Error ? error.message : "Failed to delete product.");
      }
    });
  });
};

export const attachAdminEditEvents = ({
  setEditingProductId,
  renderPage
}: Pick<AdminEventHandlersParams, "setEditingProductId" | "renderPage">): void => {
  const editButtons = document.querySelectorAll<HTMLButtonElement>(".edit-btn");
  const cancelEditButton = document.getElementById("cancel-edit-btn");

  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number(button.dataset.productId);

      if (!productId) {
        return;
      }

      setEditingProductId(productId);
      renderPage();
    });
  });

  cancelEditButton?.addEventListener("click", () => {
    setEditingProductId(null);
    renderPage();
  });
};

export const attachAdminEvents = ({
  editingProductId,
  setEditingProductId,
  renderPage
}: AdminEventHandlersParams): void => {
  const form = document.getElementById("add-product-form") as HTMLFormElement | null;
  const adminMessage = document.getElementById("admin-message");

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = getToken();

    if (!token) {
      if (adminMessage) {
        adminMessage.textContent = "Nema tokena. Uloguj se kao admin.";
      }
      return;
    }

    const formData = new FormData(form);

    const product = {
      title: String(formData.get("title") || "").trim(),
      price: Number(formData.get("price") || 0),
      stock: Number(formData.get("stock") || 0),
      category: String(formData.get("category") || "").trim(),
      image: String(formData.get("image") || "").trim(),
      description: String(formData.get("description") || "").trim(),
      is_featured: formData.get("is_featured") ? 1 : 0,
      is_best_seller: formData.get("is_best_seller") ? 1 : 0
    };

    try {
      if (editingProductId !== null) {
        await updateProduct(editingProductId, product, token);

        if (adminMessage) {
          adminMessage.textContent = "Product updated successfully.";
        }

        setEditingProductId(null);
      } else {
        await addProduct(product, token);

        if (adminMessage) {
          adminMessage.textContent = "Product added successfully.";
        }
      }

      form.reset();
      await renderPage();
    } catch (error) {
      if (adminMessage) {
        adminMessage.textContent =
          error instanceof Error ? error.message : "Product action failed.";
      }
    }
  });

  attachAdminEditEvents({ setEditingProductId, renderPage });
  attachAdminDeleteEvents({ renderPage });
};