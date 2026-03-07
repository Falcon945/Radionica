import type { AuthUser } from "../types/Auth.js";
import type { Product } from "../types/Product.js";
import { renderAuthForms, renderAuthStatus } from "../components/authForms.js";
import { renderBestSellers, renderCarousel } from "../components/homeSections.js";

type RenderHomePageParams = {
  user: AuthUser | null;
  featuredProducts: Product[];
  bestSellerProducts: Product[];
  currentSlideIndex: number;
};

export const renderHomePage = ({
  user,
  featuredProducts,
  bestSellerProducts,
  currentSlideIndex
}: RenderHomePageParams): string => {
  return `
    <main class="home-page">
      <section class="hero">
        <h1>Online Shop</h1>
        <p>Minimal shop frontend povezan sa TypeScript backend-om i SQLite bazom.</p>
      </section>

        <div id="auth-status-mount">
            ${renderAuthStatus(user)}
        </div>

        ${
            !user
            ? `
            <section class="auth-toggle-section">
                <div class="auth-toggle-card">
                    <h2>Prijava i registracija</h2>
                    <p>Uloguj se ili kreiraj nalog da bi mogao da šalješ porudžbine i pratiš svoj status.</p>
                    <button type="button" id="toggle-auth-btn" class="secondary-btn">
                        Otvori prijavu / registraciju
                    </button>

                    <div id="auth-forms-wrapper" class="auth-forms-hidden">
                        ${renderAuthForms()}
                    </div>
                </div>
            </section>
            `
            : ""
        }

      <div class="carousel-wrapper">
        ${renderCarousel(featuredProducts, currentSlideIndex)}
      </div>

      ${renderBestSellers(bestSellerProducts)}
    </main>
  `;
};