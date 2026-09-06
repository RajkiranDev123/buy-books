import { Router } from "express";
import * as orderController from "../controllers/orderController";
import { auth } from "../middleware/authMiddleware";

const router = Router();

router.post("/", auth, orderController.createOrUpdateOrder);

router.get("/", auth, orderController.getOrderByUser);

router.get("/:id", auth, orderController.getOrderById);

router.post( "/payment-razorpay", auth, orderController.createPaymentWithRazorpay);
router.post("/razorpay-webhook", auth, orderController.handleRazorPayWebhook);

export default router;
