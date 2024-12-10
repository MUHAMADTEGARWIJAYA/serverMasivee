import jwt from 'jsonwebtoken';
import db from '../config/Database.js'; // Pastikan Anda memiliki instance db yang terhubung

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log("Authorization Header:", authHeader); // Debug header
  
  const token = authHeader && authHeader.split(' ')[1];
  console.log("Extracted Token:", token); // Debug token
  
  if (token == null) {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token tidak valid atau telah kadaluarsa' });
    }

    req.userId = decoded.userId; // Simpan userId ke req
    req.email = decoded.email; // Menyimpan email yang terdekripsi dalam request

    // Cek apakah seller ada berdasarkan userId yang ada di token
    const query = `SELECT * FROM sellers WHERE userId = ?`;
    db.query(query, [decoded.userId], (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Terjadi kesalahan dalam memverifikasi seller', error: error.message });
      }

      const seller = results[0]; // Ambil seller pertama dari hasil query
      console.log('Seller:', seller);

      if (seller) {
        req.sellerId = seller.id; // Simpan sellerId ke req jika seller ditemukan
      } else {
        req.sellerId = null; // Jika tidak ada seller terkait, set sellerId null
      }

      next();
    });
  });
};
