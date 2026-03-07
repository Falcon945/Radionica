import { updateOrderStatus } from "../services/orders.js";
import { getToken } from "../utils/storage.js";

type AttachAdminOrderEventsParams = {
  renderPage: () => Promise<void>;
};

export const attachAdminOrderEvents = ({
  renderPage
}: AttachAdminOrderEventsParams): void => {
  const shipButtons = document.querySelectorAll<HTMLButtonElement>(".ship-order-btn");
  const token = getToken();

  if (!token) {
    return;
  }

  shipButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const orderId = Number(button.dataset.orderId);

      try {
        await updateOrderStatus(orderId, "shipped", token);
        renderPage();
      } catch (error) {
        alert(error instanceof Error ? error.message : "Greška pri promeni statusa.");
      }
    });
  });
};