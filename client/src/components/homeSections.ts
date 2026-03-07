import type { Product } from "../types/Product.js";

export const renderBestSellers = (products: Product[]): string => {
  return `
    <section class="best-sellers-section">
      <h2>Najprodavaniji proizvodi</h2>
      <div class="best-sellers-grid">
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
                  <span>Kategorija: ${product.category}</span>
                  <strong>$${product.price.toFixed(2)}</strong>
                </button>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
};

export const renderCarousel = (
  products: Product[],
  currentSlideIndex: number
): string => {
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

        <article
          class="carousel-slide carousel-slide-clickable"
          data-product-id="${activeProduct.id}"
        >
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