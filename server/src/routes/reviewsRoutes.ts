import { Router } from "express";
import {
  getReviewsByProduct,
  createReview,
} from "../controllers/reviewsController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.get("/product/:productId", getReviewsByProduct);
router.post("/", requireAuth, createReview);

export default router;
