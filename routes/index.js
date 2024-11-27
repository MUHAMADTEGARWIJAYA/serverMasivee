import express from "express";
import { getUsers, Login, Register, Logout } from "../controllers/user.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken } from "../controllers/refreshToken.js";const router = express.Router();

router.get('/getusers',verifyToken, getUsers);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);
export default router;