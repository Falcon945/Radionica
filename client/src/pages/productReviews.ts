import { addReview, getProductReviews } from "../services/reviews.js";
import { renderStars } from "../utils/renderStars.js";

type Review = {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  user_name: string;
};

const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

const formatReviewDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("sr-RS");
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

export const setupProductReviews = async (productId: number): Promise<void> => {
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
      const reviews: Review[] = await getProductReviews(productId);
      reviewsList.innerHTML = renderReviewsList(reviews);
    } catch (error) {
      console.error("Greška pri učitavanju recenzija:", error);
      reviewsList.innerHTML = `<p class="form-error">Ne mogu da učitam recenzije.</p>`;
    }
  };

  await loadReviews();

  reviewForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = getAuthToken();

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
          productId,
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
