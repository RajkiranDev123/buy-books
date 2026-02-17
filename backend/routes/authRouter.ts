import { Router } from "express";
import * as authController from "../controllers/authController";
import { auth } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", authController.register);
router.post("/verify-email/:token", authController.verifyEmail);

router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);
router.get("/logout", authController.logout);
router.get("/verify-auth",auth, authController.checkUserAuth);

export default router;
