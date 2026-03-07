import { Router } from "express";
import * as wishListController from "../controllers/wishListController";
import { auth } from "../middleware/authMiddleware";

const router = Router();

router.post("/add", auth, wishListController.addToWishList);
router.delete("/remove/:productId", auth, wishListController.removeFromWishList);
router.get("/:userId", auth, wishListController.getWishListByUser);

export default router;
