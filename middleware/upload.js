import multer from "multer";
import path from "path";

// Konfigurasi Penyimpanan
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder tempat menyimpan file
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Nama file yang unik
    }
});

// Filter Jenis File
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Terima file
    } else {
        cb(new Error("Only .jpeg, .jpg, .png formats are allowed!"), false); // Tolak file
    }
};

// Konfigurasi Multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Batasi ukuran file maksimal 10MB (sesuaikan sesuai kebutuhan)
});

// Middleware Error Handling untuk Multer
export const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Error spesifik dari multer
        return res.status(400).json({ message: err.message });
    } else if (err) {
        // Error lain
        return res.status(400).json({ message: err.message });
    }
    next();
};

export default upload;
