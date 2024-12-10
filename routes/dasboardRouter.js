import express from "express";
import {
  createUserDashboard,
  getUserDashboard,
  updateUserDashboard,
  deleteUserDashboard,
} from "../controllers/dashboardController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import upload from "../middleware/upload.js";
const router = express.Router();

// Route untuk membuat user dashboard baru
router.post("/tambah", upload.single('avatar'), verifyToken, createUserDashboard);

// Route untuk mendapatkan user dashboard berdasarkan user_id
router.get("/dapat",verifyToken, getUserDashboard);

// Route untuk memperbarui user dashboard berdasarkan user_id
router.put("/edit",upload.single('avatar'), verifyToken, updateUserDashboard);

// Route untuk menghapus user dashboard berdasarkan user_id
router.delete("/:user_id", deleteUserDashboard);

export default router;
