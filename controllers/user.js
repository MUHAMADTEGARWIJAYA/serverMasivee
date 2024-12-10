import db from "../config/Database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = (req, res) => {
  const query = "SELECT id, name, email FROM users";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err.message);
      return res.status(500).json({ msg: "Server error" });
    }
    res.json(results);
  });
};

export const Register = async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ msg: "Password dan konfirmasi password tidak cocok" });
  }

  try {
    const queryCheck = "SELECT * FROM users WHERE email = ?";
    db.query(queryCheck, [email], async (err, results) => {
      if (err) {
        console.error("Error checking email:", err.message);
        return res.status(500).json({ msg: "Server error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ msg: "Email telah terdaftar" });
      }

      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      const userRole = role || "buyer";

      const queryInsert = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
      db.query(queryInsert, [name, email, hashPassword, userRole], (err) => {
        if (err) {
          console.error("Error registering user:", err.message);
          return res.status(500).json({ msg: "Server error" });
        }
        res.json({ msg: "Register berhasil" });
      });
    });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error("Error fetching user:", err.message);
        return res.status(500).json({ msg: "Server error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ msg: "Email tidak ditemukan" });
      }

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ msg: "Password salah" });
      }

      const { id: userId, name, role } = user;
      const accessToken = jwt.sign({ userId, name, email, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
      const refreshToken = jwt.sign({ userId, name, email, role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });

      const queryUpdate = "UPDATE users SET refresh_token = ? WHERE id = ?";
      db.query(queryUpdate, [refreshToken, userId], (err) => {
        if (err) {
          console.error("Error updating refresh token:", err.message);
          return res.status(500).json({ msg: "Server error" });
        }

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({ accessToken });
      });
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const Logout = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  const query = "SELECT * FROM users WHERE refresh_token = ?";
  db.query(query, [refreshToken], (err, results) => {
    if (err) {
      console.error("Error fetching user for logout:", err.message);
      return res.status(500).json({ msg: "Server error" });
    }

    if (results.length === 0) return res.sendStatus(204);

    const userId = results[0].id;
    const queryUpdate = "UPDATE users SET refresh_token = NULL WHERE id = ?";
    db.query(queryUpdate, [userId], (err) => {
      if (err) {
        console.error("Error clearing refresh token:", err.message);
        return res.status(500).json({ msg: "Server error" });
      }

      res.clearCookie("refreshToken");
      res.sendStatus(200);
    });
  });
};
