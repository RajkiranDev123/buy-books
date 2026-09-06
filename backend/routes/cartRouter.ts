import { Router } from "express";
import * as cartController from "../controllers/cartController";
import { auth } from "../middleware/authMiddleware";

const router = Router();

router.post("/add", auth, cartController.addToCart);

router.delete("/remove/:productId", auth, cartController.removeItemFromCart);

router.get("/:userId", auth, cartController.getCartByUser);

export default router;
