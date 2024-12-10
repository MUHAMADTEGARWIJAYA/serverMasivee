import multer from 'multer';
import db from "../config/Database.js";

// Konfigurasi multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage: storage });

export const getRandomProducts = (req, res) => {
    const query = "SELECT * FROM product ORDER BY RAND() LIMIT 4";
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.status(200).json({ success: true, data: results });
    });
};

export const createProduct = (req, res) => {
    const { name, description, price, weight } = req.body;
    const imageUrl = req.files?.imageUrl?.[0]?.path || null;
    const document = req.files?.document?.[0]?.path || null;
    const sellerId = req.sellerId;
    if (!sellerId) return res.status(403).json({ message: 'Seller ID is required' });

    const query = "SELECT storeName FROM sellers WHERE id = ?";
    db.query(query, [sellerId], (err, seller) => {
        if (err || seller.length === 0) return res.status(404).json({ message: 'Seller not found' });

        const insertQuery = `
            INSERT INTO product (name, description, price, weight, imageUrl, document, sellerId, storeName)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [name, description, price, weight, imageUrl, document, sellerId, seller[0].storeName];
        db.query(insertQuery, values, (err) => {
            if (err) return res.status(500).json({ message: err.message });
            res.status(201).json({ message: "Product created successfully" });
        });
    });
};

export const getProducts = (req, res) => {
    db.query("SELECT * FROM product", (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(results);
    });
};

export const getProductById = (req, res) => {
    db.query("SELECT * FROM product WHERE id = ?", [req.params.id], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ message: "Product not found" });
        res.json(results[0]);
    });
};

export const getProductsBySellerId = (req, res) => {
    const sellerId = req.sellerId;
    if (!sellerId) return res.status(400).json({ message: 'Seller ID is required' });

    db.query("SELECT * FROM product WHERE sellerId = ?", [sellerId], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ message: 'No products found' });
        res.status(200).json({ success: true, data: results });
    });
};

export const updateProduct = (req, res) => {
    const { name, description, price, weight } = req.body;
    const updatedData = { name, description, price, weight };
    const sellerId = req.sellerId;
    if (!sellerId) return res.status(403).json({ message: 'Seller ID is required' });

    db.query("SELECT * FROM product WHERE id = ?", [req.params.id], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ message: "Product not found" });
        if (results[0].sellerId !== sellerId) return res.status(403).json({ message: "Unauthorized" });

        if (req.files?.imageUrl?.[0]?.path) updatedData.imageUrl = req.files.imageUrl[0].path;

        const updateQuery = `
            UPDATE product SET name = ?, description = ?, price = ?, weight = ?, imageUrl = ?
            WHERE id = ?
        `;
        const values = [updatedData.name, updatedData.description, updatedData.price, updatedData.weight, updatedData.imageUrl, req.params.id];
        db.query(updateQuery, values, (err) => {
            if (err) return res.status(400).json({ message: err.message });
            res.json({ message: "Product updated successfully" });
        });
    });
};

export const deleteProduct = (req, res) => {
    const sellerId = req.sellerId;
    if (!sellerId) return res.status(403).json({ message: 'Seller ID is required' });

    db.query("SELECT * FROM product WHERE id = ?", [req.params.id], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ message: "Product not found" });
        if (results[0].sellerId !== sellerId) return res.status(403).json({ message: "Unauthorized" });

        db.query("DELETE FROM product WHERE id = ?", [req.params.id], (err) => {
            if (err) return res.status(500).json({ message: err.message });
            res.json({ message: "Product deleted successfully" });
        });
    });
};
