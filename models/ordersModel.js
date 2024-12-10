import db from "../config/Database.js";

// Fungsi untuk membuat order baru
const createOrder = (userId, cartId, sellerId, productId, quantity, totalPrice, shippingAddress, paymentMethod, callback) => {
  const query = `
    INSERT INTO orders (userId, cartId, sellerId, productId, quantity, totalPrice, shippingAddress, paymentMethod, orderStatus)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
  `;
  db.query(query, [userId, cartId, sellerId, productId, quantity, totalPrice, shippingAddress, paymentMethod], callback);
};

// Fungsi untuk mendapatkan order berdasarkan userId
const getOrderByUserId = (userId, callback) => {
  const query = `
    SELECT * FROM orders WHERE userId = ?
  `;
  db.query(query, [userId], callback);
};

// Fungsi untuk mendapatkan order berdasarkan orderId
const getOrderById = (orderId, callback) => {
  const query = `
    SELECT * FROM orders WHERE id = ?
  `;
  db.query(query, [orderId], callback);
};

// Fungsi untuk mengupdate status order
const updateOrderStatus = (orderId, status, callback) => {
  const query = `
    UPDATE orders SET orderStatus = ? WHERE id = ?
  `;
  db.query(query, [status, orderId], callback);
};

// Fungsi untuk mengupdate alamat pengiriman order
const updateShippingAddress = (orderId, shippingAddress, callback) => {
  const query = `
    UPDATE orders SET shippingAddress = ? WHERE id = ?
  `;
  db.query(query, [shippingAddress, orderId], callback);
};

// Fungsi untuk menghapus order
const deleteOrder = (orderId, callback) => {
  const query = `
    DELETE FROM orders WHERE id = ?
  `;
  db.query(query, [orderId], callback);
};

export { createOrder, getOrderByUserId, getOrderById, updateOrderStatus, updateShippingAddress, deleteOrder };
