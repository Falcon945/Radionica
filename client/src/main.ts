import { loginUser, registerUser } from "./services/auth.js";
import { renderAuthForms, renderAuthStatus } from "./components/authForms.js";
import { renderHeader } from "./components/header.js";
import {
  renderBestSellers,
  renderCarousel,
} from "./components/homeSections.js";
import { renderHomePage } from "./pages/homePage.js";
import { renderProductsPage } from "./pages/productsPage.js";
import {
  renderProductDetailsPage,
  setupProductDetailsReviews,
} from "./pages/productDetailsPage.js";
import { renderCartPage } from "./pages/cartPage.js";
import { renderAdminPage } from "./pages/adminPage.js";
import { attachAdminEvents } from "./components/adminEvents.js";
import {
  renderAdminOrdersPage,
  renderMyOrdersPage,
} from "./pages/ordersPage.js";
import { attachCartEvents } from "./components/cartEvents.js";
import { attachAdminOrderEvents } from "./components/orderEvents.js";
import { renderAboutPage } from "./pages/aboutPage.js";
import { renderContactPage } from "./pages/contactPage.js";
import { renderFooter } from "./components/footer.js";
import {
  attachCarouselProductEvent,
  attachProductCardEvents,
  attachProductDetailsEvents,
} from "./components/productEvents.js";
import {
  attachCarouselEvents,
  updateCarouselOnly,
} from "./components/carouselEvents.js";

import {
  getAllProducts,
  getBestSellerProducts,
  getFeaturedProducts,
  getProductById,
} from "./services/products.js";
import {
  addProduct,
  deleteProduct,
  getAllProductsAdmin,
  updateProduct,
} from "./services/adminProducts.js";
import type { AuthUser } from "./types/Auth.js";
import type { Product } from "./types/Product.js";
import { clearAuth, getToken, getUser, saveAuth } from "./utils/storage.js";
import {
  createOrder,
  getAllOrdersAdmin,
  getMyOrders,
  updateOrderStatus,
} from "./services/orders.js";
import {
  addToCart,
  getCart,
  getCartTotal,
  getCartItemsCount,
  removeCartItem,
  clearCart,
  increaseCartItemQuantity,
  decreaseCartItemQuantity,
} from "./utils/cart.js";
import type { CartItem } from "./types/Cart.js";

const app = document.getElementById("app");

if (!app) {
  throw new Error("App root element not found.");
}

let featuredProductsState: Product[] = [];
let currentSlideIndex = 0;
let autoSlideInterval: number | null = null;
let editingProductId: number | null = null;

const setCurrentSlideIndex = (value: number): void => {
  currentSlideIndex = value;
};

const setEditingProductId = (id: number | null): void => {
  editingProductId = id;
};

declare global {
  interface Window {
    navigate: (url: string) => void;
  }
}

const navigate = (url: string): void => {
  window.location.hash = url;
};

window.navigate = navigate;

window.addEventListener("hashchange", () => {
  renderPage();
});

const attachAuthToggleEvent = (): void => {
  const toggleButton = document.getElementById("toggle-auth-btn");
  const formsWrapper = document.getElementById("auth-forms-wrapper");

  toggleButton?.addEventListener("click", () => {
    formsWrapper?.classList.toggle("auth-forms-hidden");
    formsWrapper?.classList.toggle("auth-forms-visible");
  });
};

const startAutoSlide = (): void => {
  if (autoSlideInterval !== null) {
    window.clearInterval(autoSlideInterval);
  }

  autoSlideInterval = window.setInterval(() => {
    if (featuredProductsState.length > 0) {
      currentSlideIndex =
        currentSlideIndex === featuredProductsState.length - 1
          ? 0
          : currentSlideIndex + 1;

      updateCarouselOnly({
        featuredProductsState,
        currentSlideIndex,
        setCurrentSlideIndex,
        restartAutoSlide,
      });
    }
  }, 4000);
};

const restartAutoSlide = (): void => {
  startAutoSlide();
};

const refreshAuthUI = (): void => {
  const authMount = document.getElementById("auth-status-mount");

  if (!authMount) {
    return;
  }

  authMount.innerHTML = renderAuthStatus(getUser());
  attachLogoutEvent();
};

const attachLogoutEvent = (): void => {
  const logoutButton = document.getElementById("logout-btn");

  logoutButton?.addEventListener("click", () => {
    clearAuth();
    refreshAuthUI();
    renderPage();
  });
};

const attachAuthFormEvents = (): void => {
  const registerForm = document.getElementById(
    "register-form",
  ) as HTMLFormElement | null;
  const loginForm = document.getElementById(
    "login-form",
  ) as HTMLFormElement | null;
  const registerMessage = document.getElementById("register-message");
  const loginMessage = document.getElementById("login-message");

  registerForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(registerForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();

    if (registerMessage) {
      registerMessage.textContent = "Registracija u toku...";
    }

    try {
      const result = await registerUser({ name, email, password });
      saveAuth(result.token, result.user);

      if (registerMessage) {
        registerMessage.textContent = "Uspešna registracija.";
      }

      registerForm.reset();
      refreshAuthUI();
      renderPage();
    } catch (error) {
      if (registerMessage) {
        registerMessage.textContent =
          error instanceof Error ? error.message : "Greška pri registraciji.";
      }
    }
  });

  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();

    if (loginMessage) {
      loginMessage.textContent = "Prijava u toku...";
    }

    try {
      const result = await loginUser({ email, password });
      saveAuth(result.token, result.user);

      if (loginMessage) {
        loginMessage.textContent = "Uspešna prijava.";
      }

      loginForm.reset();
      refreshAuthUI();
      renderPage();
    } catch (error) {
      if (loginMessage) {
        loginMessage.textContent =
          error instanceof Error ? error.message : "Greška pri prijavi.";
      }
    }
  });
};

const renderPage = async (): Promise<void> => {
  const path = window.location.hash.replace("#", "") || "/";
  const user = getUser();

  if (path === "/admin") {
    if (!user || user.role !== "admin") {
      app.innerHTML = `
      ${renderHeader(user)}
      <main class="home-page">
        <p class="error-message">Access denied.</p>
      </main>
      ${renderFooter()}
    `;
      return;
    }

    const products = await getAllProductsAdmin();

    app.innerHTML = `
    ${renderHeader(user)}
    ${renderAdminPage(products, editingProductId)}
    ${renderFooter()}
  `;

    attachAdminEvents({
      editingProductId,
      setEditingProductId,
      renderPage,
    });

    return;
  }

  if (path === "/products") {
    try {
      const products = await getAllProducts();

      app.innerHTML = `
        ${renderHeader(user)}
        ${renderProductsPage(products)}
        ${renderFooter()}
      `;

      attachProductCardEvents();
      return;
    } catch (error) {
      console.error(error);
      app.innerHTML = `
        ${renderHeader(user)}
        <main class="products-page">
          <p class="error-message">Greška pri učitavanju proizvoda.</p>
        </main>
        ${renderFooter()}
      `;
      return;
    }
  }

  if (path.startsWith("/product/")) {
    try {
      const productId = Number(path.split("/")[2]);

      if (Number.isNaN(productId)) {
        app.innerHTML = `
        ${renderHeader(user)}
        <main class="product-details-page">
          <p class="error-message">Neispravan ID proizvoda.</p>
        </main>
        ${renderFooter()}
      `;
        return;
      }

      const product = await getProductById(productId);

      app.innerHTML = `
      ${renderHeader(user)}
      ${renderProductDetailsPage(product)}
      ${renderFooter()}
    `;

      await setupProductDetailsReviews(product);

      attachProductDetailsEvents(product, { renderPage });
      return;
    } catch (error) {
      console.error(error);
      app.innerHTML = `
      ${renderHeader(user)}
      <main class="product-details-page">
        <p class="error-message">Proizvod nije pronađen.</p>
      </main>
      ${renderFooter()}
    `;
      return;
    }
  }

  if (path === "/cart") {
    const cartItems = getCart();

    app.innerHTML = `
    ${renderHeader(user)}
    ${renderCartPage(cartItems, user)}
    ${renderFooter()}
  `;

    attachCartEvents({ renderPage });
    return;
  }

  if (path === "/my-orders") {
    const token = getToken();

    if (!token) {
      app.innerHTML = `
        ${renderHeader(user)}
        <main class="orders-page">
          <p class="error-message">Moraš biti ulogovan.</p>
        </main>
        ${renderFooter()}
      `;
      return;
    }

    try {
      const orders = await getMyOrders(token);

      app.innerHTML = `
        ${renderHeader(user)}
        ${renderMyOrdersPage(orders)}
        ${renderFooter()}
      `;
      return;
    } catch (error) {
      console.error(error);
      app.innerHTML = `
        ${renderHeader(user)}
        <main class="orders-page">
          <p class="error-message">Greška pri učitavanju porudžbina.</p>
        </main>
        ${renderFooter()}
      `;
      return;
    }
  }

  if (path === "/admin-orders") {
    const token = getToken();

    if (!token || !user || user.role !== "admin") {
      app.innerHTML = `
        ${renderHeader(user)}
        <main class="orders-page">
          <p class="error-message">Admin pristup je potreban.</p>
        </main>
        ${renderFooter()}
      `;
      return;
    }

    try {
      const orders = await getAllOrdersAdmin(token);

      app.innerHTML = `
        ${renderHeader(user)}
        ${renderAdminOrdersPage(orders)}
        ${renderFooter()}
      `;

      attachAdminOrderEvents({ renderPage });
      return;
    } catch (error) {
      console.error(error);
      app.innerHTML = `
        ${renderHeader(user)}
        <main class="orders-page">
          <p class="error-message">Greška pri učitavanju svih porudžbina.</p>
        </main>
        ${renderFooter()}
      `;
      return;
    }
  }

  if (path === "/about") {
    app.innerHTML = `
    ${renderHeader(user)}
    ${renderAboutPage()}
    ${renderFooter()}
  `;
    return;
  }

  if (path === "/contact") {
    app.innerHTML = `
    ${renderHeader(user)}
    ${renderContactPage()}
    ${renderFooter()}
  `;

    const contactForm = document.getElementById(
      "contact-form",
    ) as HTMLFormElement | null;
    const contactMessage = document.getElementById("contact-message");

    contactForm?.addEventListener("submit", (event) => {
      event.preventDefault();

      if (contactMessage) {
        contactMessage.textContent = "Poruka je uspešno poslata.";
      }

      contactForm.reset();
    });

    return;
  }

  try {
    app.innerHTML = `<p class="loading">Učitavanje proizvoda...</p>`;

    const [featuredProducts, bestSellerProducts] = await Promise.all([
      getFeaturedProducts(),
      getBestSellerProducts(),
    ]);

    featuredProductsState = featuredProducts;
    currentSlideIndex = 0;

    app.innerHTML = `
  ${renderHeader(user)}
  ${renderHomePage({
    user,
    featuredProducts: featuredProductsState,
    bestSellerProducts,
    currentSlideIndex,
  })}
  ${renderFooter()}
`;

    attachAuthFormEvents();
    attachLogoutEvent();
    attachAuthToggleEvent();
    attachCarouselEvents({
      featuredProductsState,
      currentSlideIndex,
      setCurrentSlideIndex,
      restartAutoSlide,
    });
    attachCarouselProductEvent();
    attachProductCardEvents();
    startAutoSlide();
  } catch (error) {
    console.error(error);
    app.innerHTML = `<p class="error-message">Greška pri učitavanju stranice.</p>`;
  }
};
renderPage();
