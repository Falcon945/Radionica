import { Router } from "express";
import {
  addProduct,
  editProduct,
  fetchAllProducts,
  fetchBestSellerProducts,
  fetchFeaturedProducts,
  fetchProductById,
  removeProduct
} from "../controllers/productController";
import { requireAdmin, requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.get("/", fetchAllProducts);
router.get("/featured", fetchFeaturedProducts);
router.get("/best-sellers", fetchBestSellerProducts);
router.get("/:id", fetchProductById);

router.post("/", requireAuth, requireAdmin, addProduct);
router.put("/:id", requireAuth, requireAdmin, editProduct);
router.delete("/:id", requireAuth, requireAdmin, removeProduct);

export default router;