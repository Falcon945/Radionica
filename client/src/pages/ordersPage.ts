export const renderOrdersList = (orders: any[], isAdmin = false): string => {
  if (orders.length === 0) {
    return `<p>Nema porudžbina.</p>`;
  }

  return `
    <div class="orders-list">
      ${orders
        .map(
          (order) => `
            <article class="order-card">
              <h3>Porudžbina #${order.id}</h3>
              <p>Status: <strong>${order.status}</strong></p>
              <p>Kupac: ${order.customer_name}</p>
              <p>Email: ${order.customer_email}</p>
              <p>Adresa: ${order.customer_address}</p>
              <p>Telefon: ${order.customer_phone}</p>
              <p>Ukupno: $${Number(order.total_price).toFixed(2)}</p>
              <p>Kreirano: ${order.created_at}</p>

              <div class="order-items">
                ${order.items
                  .map(
                    (item: any) => `
                      <div class="order-item-row">
                        ${item.product_title} — ${item.quantity} x $${Number(item.price).toFixed(2)}
                      </div>
                    `,
                  )
                  .join("")}
              </div>

              ${
                isAdmin
                  ? `
                    <div class="order-admin-actions">
                      <button
                        type="button"
                        class="print-order-btn"
                        data-order-id="${order.id}"
                        >
                          Print
                      </button>
                      <button
                        type="button"
                        class="ship-order-btn"
                        data-order-id="${order.id}"
                        ${order.status === "shipped" ? "disabled" : ""}
                      >
                        Mark as shipped
                      </button>
                    </div>
                  `
                  : ""
              }
            </article>
          `,
        )
        .join("")}
    </div>
  `;
};

export const renderMyOrdersPage = (orders: any[]): string => {
  return `
    <main class="orders-page">
      <section class="orders-section">
        <h1>Moje porudžbine</h1>
        ${renderOrdersList(orders, false)}
      </section>
    </main>
  `;
};

export const renderAdminOrdersPage = (orders: any[]): string => {
  return `
    <main class="orders-page">
      <section class="orders-section">
        <h1>Sve porudžbine</h1>
        ${renderOrdersList(orders, true)}
      </section>
    </main>
  `;
};
