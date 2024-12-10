import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRouter.js"; // Router user
import productRouter from "./routes/productRouter.js"; // Router produk
import sellerRouter from "./routes/sellerRouter.js";
import cartRouter from "./routes/cartRouter.js";
import ordersRouter from "./routes/ordersRouter.js"
import Store from "./routes/informasiTokoRouter.js";
import Dashboard from "./routes/dasboardRouter.js"
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
dotenv.config();


const __filename = fileURLToPath(import.meta.url); // Dapatkan nama file
const __dirname = path.dirname(__filename); // Dapatkan direktori file
const app = express();

// Middleware
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json()); // Parsing JSON
app.use(bodyParser.urlencoded({ extended: true })); // Parsing URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log("Headers:", req.headers);
    next();
});
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/user', userRouter); // Endpoint untuk user-related routes
app.use('/api/products', productRouter); // Endpoint untuk produk-related routes
app.use("/api/seller", sellerRouter);
app.use("/api/cart", cartRouter );
app.use("/api/orders", ordersRouter );
app.use("/api/store", Store );
app.use("/api/dashboard", Dashboard );
// Start server
app.listen(5000, () => console.log("Server berjalan di port 5000"));
