import mysql from 'mysql2';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Membuat pool koneksi
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // Tunggu jika semua koneksi sedang digunakan
  connectionLimit: 10,      // Maksimum koneksi dalam pool
  queueLimit: 0,     
  port: process.env.DB_PORT,       // Antrian tidak terbatas jika koneksi penuh
});

// Test koneksi pool
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the MySQL database.');
    connection.release(); // Kembalikan koneksi ke pool
  }
});

export default db;
