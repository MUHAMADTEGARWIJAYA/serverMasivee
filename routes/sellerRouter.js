import express from "express";
import { registerStore, checkStoreStatus, getSeller } from "../controllers/sellerController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/register", verifyToken, registerStore);
router.get("/status", verifyToken, checkStoreStatus);
router.get("/getSeller", verifyToken, getSeller);
export default router;
