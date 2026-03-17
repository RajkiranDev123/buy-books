import { Router } from "express";
import * as userController from "../controllers/userController";
import { auth } from "../middleware/authMiddleware";

const router = Router();

router.put("/profile/update/:userId", auth, userController.updateUserProfile);

export default router;
