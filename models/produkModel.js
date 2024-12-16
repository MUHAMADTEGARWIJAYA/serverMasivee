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
        phoneNumber VARCHAR(15),  -- Menambahkan kolom phoneNumber
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

// Jika Anda sudah memiliki tabel dan ingin menambahkan kolom phoneNumber
const alterProductTable = () => {
    const query = `ALTER TABLE products ADD COLUMN phoneNumber VARCHAR(15);`;
    db.query(query, (err) => {
        if (err) {
            console.error("Error adding phoneNumber column:", err.message);
        } else {
            console.log("phoneNumber column added to products table.");
        }
    });
};
