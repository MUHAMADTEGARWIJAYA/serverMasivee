import db from "../config/Database.js";

const createCartTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS cart (
            id INT AUTO_INCREMENT PRIMARY KEY,
            userId INT NOT NULL,
            productId INT NOT NULL,
            quantity INT DEFAULT 1,
            totalPrice FLOAT NOT NULL,
            FOREIGN KEY (productId) REFERENCES product(id)
        );
    `;
    db.query(query);
};

const addToCart = (userId, productId, quantity, totalPrice) => {
    const query = `
        INSERT INTO cart (userId, productId, quantity, totalPrice)
        VALUES (${userId}, ${productId}, ${quantity}, ${totalPrice});
    `;
    db.query(query);
};

const getCartByUserId = (userId, callback) => {
    const query = `SELECT * FROM cart WHERE userId = ${userId}`;
    db.query(query, callback);
};

const updateCart = (cartId, quantity, totalPrice) => {
    const query = `
        UPDATE cart
        SET quantity = ${quantity}, totalPrice = ${totalPrice}
        WHERE id = ${cartId};
    `;
    db.query(query);
};

const deleteFromCart = (cartId) => {
    const query = `DELETE FROM cart WHERE id = ${cartId}`;
    db.query(query);
};

export { createCartTable, addToCart, getCartByUserId, updateCart, deleteFromCart };
