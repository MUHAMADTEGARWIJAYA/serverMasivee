// routes/cartRoutes.js
import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { addToCart, getCart, updateCartItem, removeFromCart  } from '../controllers/cartController.js';
const router = express.Router();


// Menambah produk ke keranjang
router.post('/add', verifyToken, addToCart);

// Mengambil data keranjang berdasarkan user_id
router.get('/getcart', verifyToken, getCart);

// Mengupdate jumlah produk dalam keranjang
router.put('/update', verifyToken, updateCartItem);

// Menghapus produk dari keranjang
router.delete('/remove',verifyToken, removeFromCart);

export default router;
