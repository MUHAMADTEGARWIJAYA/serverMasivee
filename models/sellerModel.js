import db from "../config/Database.js";

const createSellerTable = () => {
    const query = `
    CREATE TABLE IF NOT EXISTS sellers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        fullName VARCHAR(255) NOT NULL,
        storeName VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        phone VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
    `;
    db.query(query, (err, result) => {
        if (err) {
            console.error("Error creating sellers table:", err.message);
        } else {
            console.log("Sellers table created or already exists.");
        }
    });
};

const insertSeller = (userId, fullName, storeName, address, phone, email, callback) => {
    const query = `
        INSERT INTO sellers (userId, fullName, storeName, address, phone, email)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [userId, fullName, storeName, address, phone, email], callback);
};

const getSellerByUserId = (userId, callback) => {
    const query = "SELECT * FROM sellers WHERE userId = ?";
    db.query(query, [userId], callback);
};

const updateSeller = (userId, fullName, storeName, address, phone, email, callback) => {
    const query = `
        UPDATE sellers
        SET fullName = ?, storeName = ?, address = ?, phone = ?, email = ?
        WHERE userId = ?
    `;
    db.query(query, [fullName, storeName, address, phone, email, userId], callback);
};

const deleteSeller = (userId, callback) => {
    const query = "DELETE FROM sellers WHERE userId = ?";
    db.query(query, [userId], callback);
};

export { createSellerTable, insertSeller, getSellerByUserId, updateSeller, deleteSeller };
