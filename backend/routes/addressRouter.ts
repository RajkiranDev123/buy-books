import { Router } from "express";
import * as addressController from "../controllers/addressController";
import { auth } from "../middleware/authMiddleware";

const router = Router();

router.post("/create-or-update", auth, addressController.createOrUpdateAddressByUserId);
router.get("/", auth, addressController.getUserAddressByUserId);


export default router;
