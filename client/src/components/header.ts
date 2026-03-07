import type { AuthUser } from "../types/Auth.js";
import { getCartItemsCount } from "../utils/cart.js";

export const renderHeader = (user: AuthUser | null): string => {
  const cartCount = getCartItemsCount();

  return `
    <header class="site-header">
      <div class="nav">

        <h2 class="logo">Prodavnica</h2>

        <nav>

          <button onclick="window.navigate('/')">
            Home
          </button>

          <button onclick="window.navigate('/products')">
            Products
          </button>

          <button onclick="window.navigate('/cart')">
            Cart (${cartCount})
          </button>

          ${
            user
              ? `<button onclick="window.navigate('/my-orders')">My Orders</button>`
              : ""
          }

          ${
            user?.role === "admin"
              ? `
                <button onclick="window.navigate('/admin')">
                  Admin
                </button>

                <button onclick="window.navigate('/admin-orders')">
                  Orders
                </button>
              `
              : ""
          }

        </nav>
      </div>
    </header>
  `;
};