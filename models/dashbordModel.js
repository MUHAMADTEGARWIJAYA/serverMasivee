import db from "../config/Database.js";

// Membuat tabel user_dashboard tanpa ORM (Sequelize)
const createUserDashboardTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS user_dashboard (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      avatar VARCHAR(255),
      phone_number VARCHAR(255),
      gender ENUM('Laki-laki', 'Perempuan'),
      birth_date DATE,
      address TEXT
    );
  `;
  db.query(query, (err) => {
    if (err) {
      console.error("Error creating user_dashboard table:", err.message);
    } else {
      console.log("user_dashboard table created or already exists.");
    }
  });
};

// Fungsi untuk menambahkan data ke tabel user_dashboard
const insertUserDashboard = (userDashboard, callback) => {
  const query = `
    INSERT INTO user_dashboard (userId, full_name, email, avatar, phone_number, gender, birth_date, address)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    userDashboard.userId, userDashboard.full_name, userDashboard.email, userDashboard.avatar,
    userDashboard.phone_number, userDashboard.gender, userDashboard.birth_date, userDashboard.address
  ];
  db.query(query, values, callback);
};

// Fungsi untuk mendapatkan data user_dashboard berdasarkan userId
const getUserDashboardByUserId = (userId, callback) => {
  const query = "SELECT * FROM user_dashboard WHERE userId = ?";
  db.query(query, [userId], callback);
};

// Fungsi untuk memperbarui data user_dashboard
const updateUserDashboard = (userId, userDashboard, callback) => {
  const query = `
    UPDATE user_dashboard
    SET full_name = ?, email = ?, avatar = ?, phone_number = ?, gender = ?, birth_date = ?, address = ?
    WHERE userId = ?
  `;
  const values = [
    userDashboard.full_name, userDashboard.email, userDashboard.avatar, userDashboard.phone_number,
    userDashboard.gender, userDashboard.birth_date, userDashboard.address, userId
  ];
  db.query(query, values, callback);
};

// Fungsi untuk menghapus data user_dashboard berdasarkan userId
const deleteUserDashboard = (userId, callback) => {
  const query = "DELETE FROM user_dashboard WHERE userId = ?";
  db.query(query, [userId], callback);
};

export { createUserDashboardTable, insertUserDashboard, getUserDashboardByUserId, updateUserDashboard, deleteUserDashboard };
