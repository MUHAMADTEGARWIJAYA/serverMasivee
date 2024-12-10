import express from 'express';
import { createOrder, getUserOrders, getSellerOrders, updateOrderStatus } from '../controllers/ordersController.js';
import { verifyToken } from '../middleware/verifyToken.js'; // Untuk verifikasi JWT Token

const router = express.Router();

// Endpoint untuk membuat pesanan baru
router.post('/create', verifyToken, createOrder); 

// Endpoint untuk mendapatkan pesanan milik user
router.get('/user/orders', verifyToken, getUserOrders);

// Endpoint untuk mendapatkan pesanan untuk seller tertentu
router.get('/seller/:sellerId/orders', verifyToken, getSellerOrders);

// Endpoint untuk mengubah status pesanan (hanya bisa dilakukan oleh seller atau admin)
router.put('/update-status', verifyToken, updateOrderStatus);

export default router;
