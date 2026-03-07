import type { AuthUser } from "../types/Auth.js";
import type { CartItem } from "../types/Cart.js";
import { getCartTotal } from "../utils/cart.js";

export const renderCartPage = (
  cartItems: CartItem[],
  user: AuthUser | null
): string => {
  const total = getCartTotal();

  if (cartItems.length === 0) {
    return `
      <main class="cart-page">
        <section class="cart-section">
          <h1>Korpa</h1>
          <p>Tvoja korpa je prazna.</p>
          <button type="button" class="secondary-btn" onclick="window.navigate('/products')">
            Idi na proizvode
          </button>
        </section>
      </main>
    `;
  }

  return `
    <main class="cart-page">
      <section class="cart-section">
        <h1>Korpa</h1>

        <div class="cart-list">
          ${cartItems
            .map(
              (item) => `
                <article class="cart-item">
                  <img src="${item.image}" alt="${item.title}" />

                  <div class="cart-item-info">
                    <h3>${item.title}</h3>
                    <p>Cena: $${item.price.toFixed(2)}</p>
                    <p>Količina: ${item.quantity}</p>
                    <p>Ukupno: $${(item.price * item.quantity).toFixed(2)}</p>
                  </div>

                  <div class="cart-item-actions">
                    <button
                      type="button"
                      class="cart-remove-btn"
                      data-cart-id="${item.id}"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              `
            )
            .join("")}
        </div>

        <div class="cart-summary">
          <h2>Ukupno: $${total.toFixed(2)}</h2>
          <button type="button" id="clear-cart-btn" class="secondary-btn">
            Clear cart
          </button>
        </div>

        ${
          user
            ? `
              <section class="checkout-section">
                <h2>Checkout</h2>
                <form id="checkout-form" class="checkout-form">
                  <input type="text" name="customerName" placeholder="Ime i prezime" required />
                  <input type="email" name="customerEmail" placeholder="Email" required />
                  <input type="text" name="customerAddress" placeholder="Adresa" required />
                  <input type="text" name="customerPhone" placeholder="Telefon" required />
                  <button type="submit">Pošalji porudžbinu</button>
                </form>
                <p id="checkout-message" class="form-message"></p>
              </section>
            `
            : `
              <section class="checkout-section">
                <p>Moraš biti ulogovan da bi poslao porudžbinu.</p>
              </section>
            `
        }
      </section>
    </main>
  `;
};