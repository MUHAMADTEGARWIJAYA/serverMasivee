import express from "express";
import {
    getProducts,
    getRandomProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsBySellerId,
} from "../controllers/produkController.js";
import { verifyToken } from "../middleware/verifyToken.js";

import upload from "../middleware/upload.js";




const router = express.Router();
router.get('/random',verifyToken, getRandomProducts);
router.get('/products', getProducts);
router.get('/products/:id', verifyToken, getProductById);
router.post('/products', verifyToken, upload.fields([
    { name: 'imageUrl', maxCount: 1 },
    { name: 'document', maxCount: 1 }
]), (req, res, next) => {
    console.log('Files:', req.files);
    console.log('Body:', req.body);
    console.log('Seller ID:', req.sellerId);
    next();
}, createProduct);
router.put('/update/:id', verifyToken, upload.fields([
    { name: 'imageUrl', maxCount: 1 },
    { name: 'document', maxCount: 1 }
]), (req, res, next) => {
    console.log('Files:', req.files);
    console.log('Body:', req.body);
    console.log('Seller ID:', req.sellerId);
    next();
}, updateProduct);
router.delete('/delete/:id', verifyToken, deleteProduct);
router.get('/getseller', verifyToken,  getProductsBySellerId); // Hanya seller yang terverifikasi yang bisa akses
export default router;
