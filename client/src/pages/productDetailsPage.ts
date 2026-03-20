import type { Product } from "../types/Product.js";
import { getProductReviews, addReview } from "../services/reviews.js";

type Review = {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  user_name: string;
};

const renderStars = (rating: number): string => {
  return `${"★".repeat(rating)}${"☆".repeat(5 - rating)}`;
};

const formatReviewDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("sr-RS");
};

const renderReviewsList = (reviews: Review[]): string => {
  if (!reviews.length) {
    return `<p class="no-reviews">Još nema recenzija za ovaj proizvod.</p>`;
  }

  return reviews
    .map(
      (review) => `
        <article class="review-card">
          <div class="review-card-header">
            <strong>${review.user_name}</strong>
            <span class="review-stars">${renderStars(review.rating)}</span>
          </div>
          <p class="review-date">${formatReviewDate(review.created_at)}</p>
          <p class="review-comment">${review.comment || "Bez komentara."}</p>
        </article>
      `,
    )
    .join("");
};

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

          <section class="reviews-section">
            <h2>Reviews</h2>

            <div id="reviews-list"></div>

            <form id="review-form">
              <label for="review-rating">Rating</label>

              <select id="review-rating" name="rating">
                <option value="5">★★★★★</option>
                <option value="4">★★★★</option>
                <option value="3">★★★</option>
                <option value="2">★★</option>
                <option value="1">★</option>
              </select>

              <textarea
                name="comment"
                placeholder="Write your review"
              ></textarea>

              <button type="submit">Submit review</button>
            </form>
          </section>

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

export const setupProductDetailsReviews = async (
  product: Product,
): Promise<void> => {
  const reviewsList = document.getElementById("reviews-list");
  const reviewForm = document.getElementById(
    "review-form",
  ) as HTMLFormElement | null;
  const messageEl = document.getElementById("product-details-message");

  if (!reviewsList || !reviewForm) {
    return;
  }

  const loadReviews = async () => {
    try {
      const reviews: Review[] = await getProductReviews(product.id);
      reviewsList.innerHTML = renderReviewsList(reviews);
    } catch (error) {
      console.error("Greška pri učitavanju recenzija:", error);
      reviewsList.innerHTML = `<p class="form-error">Ne mogu da učitam recenzije.</p>`;
    }
  };

  await loadReviews();

  reviewForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("shop_token");

    if (!token) {
      if (messageEl) {
        messageEl.textContent =
          "Morate biti prijavljeni da biste ostavili recenziju.";
      }
      return;
    }

    const formData = new FormData(reviewForm);
    const rating = Number(formData.get("rating"));
    const comment = String(formData.get("comment") || "");

    try {
      const result = await addReview(
        {
          productId: product.id,
          rating,
          comment,
        },
        token,
      );

      if (messageEl) {
        messageEl.textContent =
          result.message || "Recenzija je uspešno poslata.";
      }

      reviewForm.reset();
      await loadReviews();
    } catch (error) {
      console.error("Greška pri slanju recenzije:", error);

      if (messageEl) {
        messageEl.textContent = "Greška pri slanju recenzije.";
      }
    }
  });
};
