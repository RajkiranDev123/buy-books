import { Router } from "express";
import * as productController from "../controllers/productController";
import { auth } from "../middleware/authMiddleware";
import { multerMiddleware } from "../config/cloudinaryConfig";

const router = Router();

router.post("/", auth, multerMiddleware, productController.createProduct);
router.get("/", auth, productController.getAllProducts);
router.get("/:id", auth, productController.getProductById);

router.delete("/seller/:productId", auth, productController.deleteProduct);
router.get("/seller/:sellerId", auth, productController.getProductBySellerId);

export default router;
