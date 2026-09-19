

import { Router } from "express";
import * as adminController from "../controllers/adminController";
import { auth } from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/adminMiddleware";

const router = Router();

router.get("/dashboard-stats",  adminController.getDashboardStats);

router.use(auth,isAdmin)

router.get("/orders",  adminController.getAllOrders);
router.post("/orders/:id",  adminController.updateOrder);


router.post("/process-seller-payment/:orderId",  adminController.processSellerPayment);
router.get("/seller-payments",  adminController.getSellerPayments);



export default router;
