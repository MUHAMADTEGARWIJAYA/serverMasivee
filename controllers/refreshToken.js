import db from "../config/Database.js"; // Pastikan ini adalah koneksi database kamu
import jwt from "jsonwebtoken";

export const refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    // Query raw SQL untuk mencari user berdasarkan refresh_token
    db.query(
        'SELECT * FROM users WHERE refresh_token = ?',
        {
            replacements: [refreshToken],
            type: db.QueryTypes.SELECT
        }
    ).then((result) => {
        if (!result.length) return res.sendStatus(403); // Tidak ada user yang cocok

        const user = result[0]; // Ambil user pertama dari hasil query
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403);
            const userId = user.id;
            const name = user.name;
            const email = user.email;
            const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '15s'
            });
            res.json({ accessToken });
        });
    }).catch((error) => {
        console.log(error);
        res.sendStatus(500); // Bisa menambahkan response error jika terjadi masalah
    });
};
