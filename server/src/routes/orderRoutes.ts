import { Router } from "express";
import {
  changeOrderStatus,
  createNewOrder,
  fetchAllOrders,
  fetchMyOrders
} from "../controllers/orderController";
import { requireAdmin, requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.post("/", requireAuth, createNewOrder);
router.get("/my-orders", requireAuth, fetchMyOrders);
router.get("/", requireAuth, requireAdmin, fetchAllOrders);
router.patch("/:id/status", requireAuth, requireAdmin, changeOrderStatus);

export default router;