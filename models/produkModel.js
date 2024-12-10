import db from "../config/Database.js";

const createProductTable = () => {
    const query = `
    CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price FLOAT NOT NULL,
        weight FLOAT NOT NULL,
        imageUrl VARCHAR(255),
        document VARCHAR(255),
        sellerId INT NOT NULL,
        storeName VARCHAR(255) NOT NULL,
        FOREIGN KEY (sellerId) REFERENCES sellers(id) ON DELETE CASCADE
    );
    `;
    db.query(query, (err) => {
        if (err) {
            console.error("Error creating products table:", err.message);
        } else {
            console.log("Products table created or already exists.");
        }
    });
};

const insertProduct = (product, callback) => {
    const query = `
        INSERT INTO products (name, description, price, weight, imageUrl, document, sellerId, storeName)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        product.name, product.description, product.price, product.weight,
        product.imageUrl, product.document, product.sellerId, product.storeName
    ];
    db.query(query, values, callback);
};

const getProductById = (id, callback) => {
    const query = "SELECT * FROM products WHERE id = ?";
    db.query(query, [id], callback);
};

const updateProduct = (id, product, callback) => {
    const query = `
        UPDATE products
        SET name = ?, description = ?, price = ?, weight = ?, imageUrl = ?, document = ?, storeName = ?
        WHERE id = ?
    `;
    const values = [
        product.name, product.description, product.price, product.weight,
        product.imageUrl, product.document, product.storeName, id
    ];
    db.query(query, values, callback);
};

const deleteProduct = (id, callback) => {
    const query = "DELETE FROM products WHERE id = ?";
    db.query(query, [id], callback);
};

export { createProductTable, insertProduct, getProductById, updateProduct, deleteProduct };
