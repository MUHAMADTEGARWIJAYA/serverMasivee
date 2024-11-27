import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import db from "./config/Database.js"
import router from "./routes/index.js";
import cors from "cors"

dotenv.config()
const app = express();


try {
    await db.authenticate();
    console.log('Database terhubung....');
} catch (error) {
    console.error(error);
}
app.use(cors({
    credentials:true,
    origin:'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(cookieParser());
app.use(express.json());
app.use(router);


app.listen(5000, ()=> console.log("server berjalan di port 5000"));


