import { loginUser, registerUser } from "./services/auth.js";
import { getBestSellerProducts, getFeaturedProducts } from "./services/products.js";
import { addProduct } from "./services/adminProducts.js";
import type { AuthUser } from "./types/Auth.js";
import type { Product } from "./types/Product.js";
import { clearAuth, getToken, getUser, saveAuth } from "./utils/storage.js";

const app = document.getElementById("app");

if (!app) {
  throw new Error("App root element not found.");
}

let featuredProductsState: Product[] = [];
let currentSlideIndex = 0;
let autoSlideInterval: number | null = null;

declare global {
  interface Window {
    navigate: (url: string) => void;
  }
}

const navigate = (url: string): void => {
  window.history.pushState({}, "", url);
  renderPage();
};

window.navigate = navigate;

window.addEventListener("popstate", () => {
  renderPage();
});

const renderHeader = (user: AuthUser | null): string => {
  return `
    <header class="site-header">
      <div class="nav">
        <h2 class="logo">Shop</h2>

        <nav>
          <button type="button" onclick="window.navigate('/')">Home</button>
          ${
            user?.role === "admin"
              ? `<button type="button" onclick="window.navigate('/admin')">Admin</button>`
              : ""
          }
        </nav>
      </div>
    </header>
  `;
};

const renderAuthStatus = (user: AuthUser | null): string => {
  if (!user) {
    return `
      <section class="auth-status">
        <div class="auth-status-content">
          <span>Nisi ulogovan.</span>
        </div>
      </section>
    `;
  }

  return `
    <section class="auth-status">
      <div class="auth-status-content">
        <span>Ulogovan: <strong>${user.name}</strong> (${user.role})</span>
        <button id="logout-btn" class="secondary-btn" type="button">Logout</button>
      </div>
    </section>
  `;
};

const renderAuthForms = (): string => {
  return `
    <section class="auth-section">
      <div class="auth-grid">
        <article class="auth-card">
          <h2>Register</h2>
          <form id="register-form" class="auth-form">
            <input type="text" name="name" placeholder="Ime" required />
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Lozinka" required />
            <button type="submit">Registracija</button>
          </form>
          <p id="register-message" class="form-message"></p>
        </article>

        <article class="auth-card">
          <h2>Login</h2>
          <form id="login-form" class="auth-form">
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Lozinka" required />
            <button type="submit">Prijava</button>
          </form>
          <p id="login-message" class="form-message"></p>
        </article>
      </div>
    </section>
  `;
};

const renderBestSellers = (products: Product[]): string => {
  return `
    <section class="best-sellers-section">
      <h2>Najprodavaniji proizvodi</h2>
      <div class="best-sellers-grid">
        ${products
          .map(
            (product) => `
              <article class="product-card">
                <img src="${product.image}" alt="${product.title}" />
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <span>Kategorija: ${product.category}</span>
                <strong>$${product.price.toFixed(2)}</strong>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
};

const renderCarousel = (products: Product[]): string => {
  if (products.length === 0) {
    return `
      <section class="carousel-section">
        <h2>Aktuelni proizvodi</h2>
        <p>Nema aktuelnih proizvoda.</p>
      </section>
    `;
  }

  const activeProduct = products[currentSlideIndex];

  return `
    <section class="carousel-section">
      <div class="section-header">
        <h2>Aktuelni proizvodi</h2>
      </div>

      <div class="carousel">
        <button class="carousel-btn" id="prev-slide" type="button" aria-label="Previous slide">
          ‹
        </button>

        <article class="carousel-slide">
          <div class="carousel-image-wrap">
            <img src="${activeProduct.image}" alt="${activeProduct.title}" />
          </div>

          <div class="carousel-content">
            <span class="carousel-category">${activeProduct.category}</span>
            <h3>${activeProduct.title}</h3>
            <p>${activeProduct.description}</p>
            <strong>$${activeProduct.price.toFixed(2)}</strong>
          </div>
        </article>

        <button class="carousel-btn" id="next-slide" type="button" aria-label="Next slide">
          ›
        </button>
      </div>

      <div class="carousel-dots">
        ${products
          .map(
            (_, index) => `
              <button
                class="carousel-dot ${index === currentSlideIndex ? "active" : ""}"
                data-index="${index}"
                type="button"
                aria-label="Go to slide ${index + 1}"
              ></button>
            `
          )
          .join("")}
      </div>
    </section>
  `;
};

const renderAdminPage = (): string => {
  return `
    <main class="admin-page">
      <h1>Admin Dashboard</h1>

      <form id="add-product-form" class="admin-form">
        <input name="title" placeholder="Product title" required />
        <input name="price" type="number" step="0.01" placeholder="Price" required />
        <input name="category" placeholder="Category" />
        <input name="image" placeholder="Image URL" />
        <textarea name="description" placeholder="Description"></textarea>
        <button type="submit">Add product</button>
      </form>

      <p id="admin-message" class="form-message"></p>
      <div id="admin-products"></div>
    </main>
  `;
};

const updateCarouselOnly = (): void => {
  const carouselContainer = document.querySelector(".carousel-wrapper");

  if (!carouselContainer) {
    return;
  }

  carouselContainer.innerHTML = renderCarousel(featuredProductsState);
  attachCarouselEvents();
};

const goToPreviousSlide = (): void => {
  if (featuredProductsState.length === 0) {
    return;
  }

  currentSlideIndex =
    currentSlideIndex === 0
      ? featuredProductsState.length - 1
      : currentSlideIndex - 1;

  updateCarouselOnly();
  restartAutoSlide();
};

const goToNextSlide = (): void => {
  if (featuredProductsState.length === 0) {
    return;
  }

  currentSlideIndex =
    currentSlideIndex === featuredProductsState.length - 1
      ? 0
      : currentSlideIndex + 1;

  updateCarouselOnly();
  restartAutoSlide();
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

      updateCarouselOnly();
    }
  }, 4000);
};

const restartAutoSlide = (): void => {
  startAutoSlide();
};

const attachCarouselEvents = (): void => {
  const prevButton = document.getElementById("prev-slide");
  const nextButton = document.getElementById("next-slide");
  const dots = document.querySelectorAll<HTMLButtonElement>(".carousel-dot");

  prevButton?.addEventListener("click", () => {
    goToPreviousSlide();
  });

  nextButton?.addEventListener("click", () => {
    goToNextSlide();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = Number(dot.dataset.index);
      currentSlideIndex = index;
      updateCarouselOnly();
      restartAutoSlide();
    });
  });
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
  const registerForm = document.getElementById("register-form") as HTMLFormElement | null;
  const loginForm = document.getElementById("login-form") as HTMLFormElement | null;
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

const attachAdminEvents = (): void => {
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
      category: String(formData.get("category") || "").trim(),
      image: String(formData.get("image") || "").trim(),
      description: String(formData.get("description") || "").trim()
    };

    try {
      await addProduct(product, token);

      if (adminMessage) {
        adminMessage.textContent = "Product added successfully.";
      }

      form.reset();
    } catch (error) {
      if (adminMessage) {
        adminMessage.textContent =
          error instanceof Error ? error.message : "Failed to add product.";
      }
    }
  });
};

const renderPage = async (): Promise<void> => {
  const path = window.location.pathname;
  const user = getUser();

  if (path === "/admin") {
    if (!user || user.role !== "admin") {
      app.innerHTML = `
        ${renderHeader(user)}
        <main class="home-page">
          <p class="error-message">Access denied.</p>
        </main>
      `;
      return;
    }

    app.innerHTML = `
      ${renderHeader(user)}
      ${renderAdminPage()}
    `;

    attachAdminEvents();
    return;
  }

  try {
    app.innerHTML = `<p class="loading">Učitavanje proizvoda...</p>`;

    const [featuredProducts, bestSellerProducts] = await Promise.all([
      getFeaturedProducts(),
      getBestSellerProducts()
    ]);

    featuredProductsState = featuredProducts;
    currentSlideIndex = 0;

    app.innerHTML = `
      ${renderHeader(user)}

      <main class="home-page">
        <section class="hero">
          <h1>Online Shop</h1>
          <p>Minimal shop frontend povezan sa TypeScript backend-om i SQLite bazom.</p>
        </section>

        <div id="auth-status-mount">
          ${renderAuthStatus(user)}
        </div>

        ${renderAuthForms()}

        <div class="carousel-wrapper">
          ${renderCarousel(featuredProductsState)}
        </div>

        ${renderBestSellers(bestSellerProducts)}
      </main>
    `;

    attachAuthFormEvents();
    attachLogoutEvent();
    attachCarouselEvents();
    startAutoSlide();
  } catch (error) {
    console.error(error);
    app.innerHTML = `<p class="error-message">Greška pri učitavanju stranice.</p>`;
  }
};

renderPage();