import db from "../config/Database.js";
import fs from "fs";
import path from "path";

export const addStoreInfo = (req, res) => {
    const { description } = req.body;
    const imageFile = req.file;
    const sellerId = req.sellerId; // Ambil sellerId dari token atau parameter

    db.query(`SELECT * FROM sellers WHERE id = ?`, [sellerId], (err, seller) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({ success: false, message: "Error checking seller." });
        }
        console.log("Seller:", seller); // Cek data seller yang dikembalikan
        if (!seller || seller.length === 0) {
            return res.status(404).json({ success: false, message: "Seller not found." });
        }
     
    

        // Cek apakah seller sudah memiliki store info
        db.query(`SELECT * FROM informasi_store WHERE sellerId = ${sellerId}`, (err, existingStore) => {
            if (err) return res.status(500).json({ success: false, message: "Error checking existing store info." });
            if (existingStore.length > 0) {
                return res.status(400).json({ success: false, message: "Store info already exists." });
            }

            // Proses gambar
            let imageUrl = null;
            if (imageFile) {
                imageUrl = `/uploads/${imageFile.filename}`;
            }

            // Insert store info
            db.query(`INSERT INTO informasi_store (description, imageUrl, sellerId) VALUES ('${description}', '${imageUrl}', ${sellerId})`, (err, result) => {
                if (err) return res.status(500).json({ success: false, message: "Error adding store information." });
                res.status(201).json({ success: true, message: "Store information added." });
            });
        });
    });
};

export const getStoreInfo = (req, res) => {
    const userId = req.userId;

    // Cari seller
    db.query(`SELECT * FROM sellers WHERE userId = ${userId}`, (err, seller) => {
        if (err) return res.status(500).json({ success: false, message: "Error checking seller." });
        if (!seller || seller.length === 0) {
            return res.status(404).json({ success: false, message: "Seller not found." });
        }

        // Ambil informasi toko
        db.query(`SELECT * FROM informasi_store WHERE sellerId = ${seller[0].id}`, (err, stores) => {
            if (err) return res.status(500).json({ success: false, message: "Error retrieving store information." });
            if (!stores || stores.length === 0) {
                return res.status(404).json({ success: false, message: "No store information found." });
            }

            res.status(200).json({ success: true, data: stores });
        });
    });
};

export const getStoreInfoById = (req, res) => {
    const { storeId } = req.params;

    if (!storeId) {
        return res.status(400).json({ success: false, message: "Store ID is required." });
    }

    // Cari informasi toko
    db.query(`SELECT * FROM informasi_store WHERE id = ${storeId}`, (err, storeInfo) => {
        if (err) return res.status(500).json({ success: false, message: "Error retrieving store information." });
        if (!storeInfo || storeInfo.length === 0) {
            return res.status(404).json({ success: false, message: "Store information not found." });
        }

        res.status(200).json({ success: true, data: storeInfo });
    });
};

export const getStorePhotoBySellerId = (req, res) => {
    const { sellerId } = req.params;

    db.query(`SELECT imageUrl FROM informasi_store WHERE sellerId = ${sellerId}`, (err, storeInfo) => {
        if (err) return res.status(500).json({ success: false, message: "Failed to retrieve store photo." });
        if (!storeInfo || storeInfo.length === 0) {
            return res.status(404).json({ success: false, message: "Store photo not found." });
        }

        res.status(200).json({ success: true, data: { imageUrl: storeInfo[0].imageUrl } });
    });
};

export const updateStoreInfo = (req, res) => {
    const { description } = req.body;
    const imageFile = req.file;
    const { storeId } = req.params;
    const sellerId = req.sellerId;

    // Cek apakah storeId ada
    db.query(`SELECT * FROM informasi_store WHERE id = ${storeId}`, (err, storeInfo) => {
        if (err) return res.status(500).json({ success: false, message: "Error retrieving store information." });
        if (!storeInfo || storeInfo.length === 0) {
            return res.status(404).json({ success: false, message: "Store information not found." });
        }

        if (storeInfo[0].sellerId !== sellerId) {
            return res.status(403).json({ success: false, message: "You can only update your own store." });
        }

        let imageUrl = storeInfo[0].imageUrl;
        if (imageFile) {
            // Hapus foto lama jika ada
            if (imageUrl) {
                const oldImagePath = path.join(__dirname, '..', 'public', imageUrl);
                if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
            }

            imageUrl = `/uploads/${imageFile.filename}`;
        }

        // Update informasi toko
        db.query(`UPDATE informasi_store SET description = '${description}', imageUrl = '${imageUrl}' WHERE id = ${storeId}`, (err, result) => {
            if (err) return res.status(500).json({ success: false, message: "Error updating store information." });
            res.status(200).json({ success: true, message: "Store information updated." });
        });
    });
};
