import db from "../config/Database.js";

// Menambah produk ke keranjang
export const addToCart = (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.userId;

  // Cek apakah produk ada di database
  const checkProductQuery = `SELECT * FROM product WHERE id = ?`;
  db.query(checkProductQuery, [productId], (err, result) => {
    if (err) return res.status(500).json({ message: "Terjadi kesalahan", error: err.message });

    if (result.length === 0) return res.status(404).json({ message: "Produk tidak ditemukan" });

    const product = result[0];
    const totalPrice = product.price * quantity;

    // Cek apakah produk sudah ada di keranjang
    const checkCartQuery = `SELECT * FROM cart WHERE userId = ? AND productId = ?`;
    db.query(checkCartQuery, [userId, productId], (err, result) => {
      if (err) return res.status(500).json({ message: "Terjadi kesalahan", error: err.message });

      if (result.length > 0) {
        // Update jumlah dan total harga jika produk sudah ada di keranjang
        const cartItem = result[0];
        const updateQuery = `UPDATE cart SET quantity = ?, totalPrice = ? WHERE id = ?`;
        db.query(updateQuery, [cartItem.quantity + quantity, cartItem.totalPrice + totalPrice, cartItem.id], (err) => {
          if (err) return res.status(500).json({ message: "Terjadi kesalahan", error: err.message });
          return res.status(200).json({ message: "Jumlah produk di keranjang diperbarui" });
        });
      } else {
        // Tambahkan produk baru ke keranjang
        const insertQuery = `INSERT INTO cart (userId, productId, quantity, totalPrice) VALUES (?, ?, ?, ?)`;
        db.query(insertQuery, [userId, productId, quantity, totalPrice], (err) => {
          if (err) return res.status(500).json({ message: "Terjadi kesalahan", error: err.message });
          return res.status(201).json({ message: "Produk berhasil ditambahkan ke keranjang" });
        });
      }
    });
  });
};

// Mengambil data keranjang berdasarkan userId
export const getCart = (req, res) => {
  const userId = req.userId;

  const query = `
    SELECT cart.id, cart.userId, cart.productId, cart.quantity, cart.totalPrice, 
           product.name, product.price, product.imageUrl
    FROM cart
    JOIN product ON cart.productId = product.id
    WHERE cart.userId = ?
  `;

  db.query(query, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: "Terjadi kesalahan", error: err.message });

    if (result.length === 0) return res.status(404).json({ message: "Keranjang kosong" });

    return res.status(200).json(result);
  });
};

// Mengupdate jumlah produk dalam keranjang
export const updateCartItem = (req, res) => {
  const { productId, operation } = req.body;
  const userId = req.userId;

  const query = `SELECT * FROM cart WHERE userId = ? AND productId = ?`;
  db.query(query, [userId, productId], (err, result) => {
    if (err) return res.status(500).json({ message: "Terjadi kesalahan", error: err.message });

    if (result.length === 0) return res.status(404).json({ message: "Produk tidak ditemukan di keranjang" });

    const cartItem = result[0];

    // Periksa operasi increment atau decrement
    if (operation === "increment") {
      cartItem.quantity += 1;
    } else if (operation === "decrement") {
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
      } else {
        return res.status(400).json({ message: "Jumlah produk tidak dapat kurang dari 1" });
      }
    } else {
      return res.status(400).json({ message: "Operasi tidak valid" });
    }

    // Update total harga
    const totalPriceQuery = `SELECT price FROM product WHERE id = ?`;
    db.query(totalPriceQuery, [productId], (err, result) => {
      if (err) return res.status(500).json({ message: "Terjadi kesalahan", error: err.message });

      const price = result[0].price;
      const updateQuery = `UPDATE cart SET quantity = ?, totalPrice = ? WHERE id = ?`;
      db.query(updateQuery, [cartItem.quantity, price * cartItem.quantity, cartItem.id], (err) => {
        if (err) return res.status(500).json({ message: "Terjadi kesalahan", error: err.message });
        return res.status(200).json({ message: "Jumlah produk di keranjang diperbarui", cart: cartItem });
      });
    });
  });
};

// Menghapus produk dari keranjang
export const removeFromCart = (req, res) => {
  const { productId } = req.body;
  const userId = req.userId;

  const query = `SELECT * FROM cart WHERE userId = ? AND productId = ?`;
  db.query(query, [userId, productId], (err, result) => {
    if (err) return res.status(500).json({ message: "Terjadi kesalahan", error: err.message });

    if (result.length === 0) return res.status(404).json({ message: "Produk tidak ditemukan di keranjang" });

    const deleteQuery = `DELETE FROM cart WHERE id = ?`;
    db.query(deleteQuery, [result[0].id], (err) => {
      if (err) return res.status(500).json({ message: "Terjadi kesalahan", error: err.message });
      return res.status(200).json({ message: "Produk berhasil dihapus dari keranjang" });
    });
  });
};
