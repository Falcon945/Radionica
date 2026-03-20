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
import { uploadProductImage } from "../middleware/uploadMiddleware";

const router = Router();

router.get("/", fetchAllProducts);
router.get("/featured", fetchFeaturedProducts);
router.get("/best-sellers", fetchBestSellerProducts);
router.get("/:id", fetchProductById);

router.post("/", requireAuth, requireAdmin, addProduct);
router.put("/:id", requireAuth, requireAdmin, editProduct);
router.delete("/:id", requireAuth, requireAdmin, removeProduct);
router.post(
  "/upload-image",
  requireAuth,
  requireAdmin,
  (req, res) => {
    uploadProductImage.single("image")(req, res, (error) => {
      if (error) {
        console.error("Upload error:", error);
        res.status(500).json({
          message: error instanceof Error ? error.message : "Image upload failed."
        });
        return;
      }

      if (!req.file) {
        res.status(400).json({ message: "No image uploaded." });
        return;
      }

      res.status(200).json({
        message: "Image uploaded successfully.",
        imageUrl: `/uploads/products/${req.file.filename}`
      });
    });
  }
);

export default router;