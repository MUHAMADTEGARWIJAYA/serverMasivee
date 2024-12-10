import db from "../config/Database.js"; // Pastikan Anda sudah memiliki instance db yang terhubung
import upload from "../middleware/upload.js";

// Create a new user dashboard
export const createUserDashboard = (req, res) => {
  const { full_name, email, phone_number, gender, birth_date, address } = req.body;
  const avatar = req.file ? req.file.path : null;

  const userId = req.userId;

  // Cek apakah user sudah ada
  const checkUserQuery = `SELECT * FROM users WHERE id = ?`;
  db.query(checkUserQuery, [userId], (err, userResults) => {
    if (err) return res.status(500).json({ message: "Error checking user", error: err.message });
    if (userResults.length === 0) return res.status(404).json({ msg: "User not found" });

    // Cek apakah dashboard sudah ada
    const checkDashboardQuery = `SELECT * FROM user_dashboard WHERE userId = ?`;
    db.query(checkDashboardQuery, [userId], (err, dashboardResults) => {
      if (err) return res.status(500).json({ message: "Error checking dashboard", error: err.message });
      if (dashboardResults.length > 0) return res.status(400).json({ msg: "Dashboard already exists" });

      // Insert data dashboard baru
      const insertQuery = `INSERT INTO user_dashboard (userId, full_name, email, avatar, phone_number, gender, birth_date, address)
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      const values = [userId, full_name, email, avatar, phone_number, gender, birth_date, address];

      db.query(insertQuery, values, (err) => {
        if (err) return res.status(500).json({ message: "Error creating dashboard", error: err.message });

        res.status(201).json({ message: "User dashboard created successfully" });
      });
    });
  });
};

// Get user dashboard by user_id
export const getUserDashboard = (req, res) => {
  const userId = req.userId;

  const query = `SELECT * FROM user_dashboard WHERE userId = ?`;
  db.query(query, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: "Error retrieving dashboard", error: err.message });
    if (result.length === 0) return res.status(404).json({ message: "User dashboard not found" });

    res.status(200).json({ message: "User dashboard retrieved successfully", data: result[0] });
  });
};

// Update user dashboard by user_id
export const updateUserDashboard = (req, res) => {
  const { full_name, email, phone_number, gender, birth_date, address } = req.body;
  const avatar = req.file ? req.file.path : null;
  const userId = req.userId;

  const query = `SELECT * FROM user_dashboard WHERE userId = ?`;
  db.query(query, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: "Error retrieving dashboard", error: err.message });
    if (result.length === 0) return res.status(404).json({ msg: "Dashboard not found" });

    // Update dashboard
    const updateQuery = `UPDATE user_dashboard SET
                         full_name = ?, email = ?, avatar = ?, phone_number = ?, gender = ?, birth_date = ?, address = ?
                         WHERE userId = ?`;
    const values = [full_name || result[0].full_name, email || result[0].email, avatar || result[0].avatar,
                   phone_number || result[0].phone_number, gender || result[0].gender, birth_date || result[0].birth_date,
                   address || result[0].address, userId];

    db.query(updateQuery, values, (err) => {
      if (err) return res.status(500).json({ message: "Error updating dashboard", error: err.message });

      res.status(200).json({ message: "User dashboard updated successfully" });
    });
  });
};

// Delete user dashboard by user_id
export const deleteUserDashboard = (req, res) => {
  const userId = req.userId;

  const query = `SELECT * FROM user_dashboard WHERE userId = ?`;
  db.query(query, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: "Error retrieving dashboard", error: err.message });
    if (result.length === 0) return res.status(404).json({ msg: "Dashboard not found" });

    const deleteQuery = `DELETE FROM user_dashboard WHERE userId = ?`;
    db.query(deleteQuery, [userId], (err) => {
      if (err) return res.status(500).json({ message: "Error deleting dashboard", error: err.message });

      res.status(200).json({ message: "User dashboard deleted successfully" });
    });
  });
};
