import { updateOrderStatus } from "../services/orders.js";
import { getToken } from "../utils/storage.js";

type AttachAdminOrderEventsParams = {
  renderPage: () => Promise<void>;
};

export const attachAdminOrderEvents = ({
  renderPage,
}: AttachAdminOrderEventsParams): void => {
  const shipButtons =
    document.querySelectorAll<HTMLButtonElement>(".ship-order-btn");
  const printButtons =
    document.querySelectorAll<HTMLButtonElement>(".print-order-btn");
  const token = getToken();

  if (token) {
    shipButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const orderId = Number(button.dataset.orderId);

        try {
          await updateOrderStatus(orderId, "shipped", token);
          renderPage();
        } catch (error) {
          alert(
            error instanceof Error
              ? error.message
              : "Greška pri promeni statusa.",
          );
        }
      });
    });
  }

  printButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const orderCard = button.closest(".order-card") as HTMLElement | null;

      if (!orderCard) {
        return;
      }

      const printWindow = window.open("", "_blank", "width=900,height=700");

      if (!printWindow) {
        return;
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>Order Print</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 24px;
                color: #111;
              }

              h1, h2, h3 {
                margin-top: 0;
              }

              .order-card {
                border: 1px solid #ccc;
                padding: 20px;
                border-radius: 10px;
              }

              .order-admin-actions {
                display: none;
              }

              .order-item-row {
                margin-bottom: 8px;
              }
            </style>
          </head>
          <body>
            <h1>Prodavnica - Interni Dokument Porudžbina</h1>
            ${orderCard.outerHTML}
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    });
  });
};
