import { Router } from "express";
import * as orderController from "../controllers/orderController";
import { auth } from "../middleware/authMiddleware";


const router = Router();

router.post("/", auth,  orderController.createOrUpdateOrder);
router.get("/", auth,  orderController.getOrderByUser);
router.get("/:id", auth,  orderController.getOrderById);




export default router;
