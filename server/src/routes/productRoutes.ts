import { Router } from "express";
import {
  fetchAllProducts,
  fetchFeaturedProducts,
  fetchBestSellerProducts
} from "../controllers/productController";

const router = Router();

router.get("/", fetchAllProducts);
router.get("/featured", fetchFeaturedProducts);
router.get("/best-sellers", fetchBestSellerProducts);

export default router;