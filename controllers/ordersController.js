import db from "../config/Database.js";

// Menambahkan Pesanan Baru (Create Order)
export const createOrder = (req, res) => {
  const { cartId, shippingAddress, paymentMethod } = req.body;

  // Ambil cart berdasarkan cartId
  db.query("SELECT * FROM carts WHERE id = ?", [cartId])
    .then(([cart]) => {
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      // Ambil informasi produk terkait dalam cart
      db.query("SELECT * FROM products WHERE id = ?", [cart.productId])
        .then(([product]) => {
          if (!product) {
            return res.status(404).json({ message: "Product not found" });
          }

          // Ambil seller terkait produk
          db.query("SELECT * FROM sellers WHERE id = ?", [product.sellerId])
            .then(([seller]) => {
              if (!seller) {
                return res.status(404).json({ message: "Seller not found" });
              }

              // Hitung total harga
              const totalPrice = cart.quantity * product.price;

              // Buat pesanan baru
              db.query(
                "INSERT INTO orders (userId, cartId, sellerId, productId, quantity, totalPrice, shippingAddress, paymentMethod, orderStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [req.userId, cart.id, seller.id, product.id, cart.quantity, totalPrice, shippingAddress, paymentMethod, "Pending"]
              )
                .then(() => {
                  // Hapus cart setelah pesanan berhasil dibuat
                  db.query("DELETE FROM carts WHERE id = ?", [cartId])
                    .then(() => {
                      res.status(201).json({
                        message: "Order successfully created and cart cleared",
                        data: { userId: req.userId, cartId: cart.id, totalPrice },
                      });
                    })
                    .catch((err) => {
                      console.error(err);
                      res.status(500).json({ message: "Failed to delete cart", error: err.message });
                    });
                })
                .catch((err) => {
                  console.error(err);
                  res.status(500).json({ message: "Failed to create order", error: err.message });
                });
            })
            .catch((err) => {
              console.error(err);
              res.status(500).json({ message: "Error fetching seller", error: err.message });
            });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ message: "Error fetching product", error: err.message });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Error fetching cart", error: err.message });
    });
};

// Mendapatkan Daftar Pesanan User
export const getUserOrders = (req, res) => {
  db.query(
    "SELECT o.*, p.name AS productName, p.price AS productPrice, s.name AS sellerName FROM orders o JOIN products p ON o.productId = p.id JOIN sellers s ON o.sellerId = s.id WHERE o.userId = ?",
    [req.userId]
  )
    .then(([orders]) => {
      if (!orders.length) {
        return res.status(404).json({ message: "No orders found" });
      }

      res.status(200).json({
        message: "User orders retrieved successfully",
        data: orders,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Error fetching user orders", error: err.message });
    });
};

// Mendapatkan Daftar Pesanan Seller (pesanan yang diterima seller)
export const getSellerOrders = (req, res) => {
  const sellerId = req.params.sellerId;

  db.query(
    "SELECT o.*, p.name AS productName, p.price AS productPrice, u.name AS userName FROM orders o JOIN products p ON o.productId = p.id JOIN users u ON o.userId = u.id WHERE o.sellerId = ?",
    [sellerId]
  )
    .then(([orders]) => {
      if (!orders.length) {
        return res.status(404).json({ message: "No orders found for this seller" });
      }

      res.status(200).json({
        message: "Seller orders retrieved successfully",
        data: orders,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Error fetching seller orders", error: err.message });
    });
};

// Mengubah Status Pesanan
export const updateOrderStatus = (req, res) => {
  const { orderId, status } = req.body;

  db.query("SELECT * FROM orders WHERE id = ?", [orderId])
    .then(([order]) => {
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Memastikan hanya seller atau admin yang dapat mengubah status pesanan
      if (order.sellerId !== req.userId && req.role !== "admin") {
        return res.status(403).json({ message: "You are not authorized to change the order status" });
      }

      // Mengubah status pesanan
      db.query("UPDATE orders SET orderStatus = ? WHERE id = ?", [status, orderId])
        .then(() => {
          res.status(200).json({
            message: "Order status updated successfully",
            data: { ...order, orderStatus: status },
          });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ message: "Error updating order status", error: err.message });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Error fetching order", error: err.message });
    });
};
