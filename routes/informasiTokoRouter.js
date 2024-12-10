import express from "express";
import { addStoreInfo, getStoreInfo, getStoreInfoById, getStorePhotoBySellerId,updateStoreInfo } from "../controllers/informasiTokoController.js";
import upload from "../middleware/upload.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

// Route untuk menambahkan informasi toko
router.post("/stores", verifyToken, upload.single("image"), addStoreInfo);

// Route untuk mendapatkan informasi toko
router.get("/getstores", verifyToken, getStoreInfo);
router.get('/storeid/:storeId', verifyToken, getStoreInfoById);
// Route untuk mendapatkan foto toko berdasarkan sellerId
router.get("/store-photo/:sellerId", verifyToken, getStorePhotoBySellerId);
router.put("/update", verifyToken, updateStoreInfo);
export default router;
