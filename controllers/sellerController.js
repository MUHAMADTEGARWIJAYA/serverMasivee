import db from "../config/Database.js";

export const registerStore = async (req, res) => {
    const { fullName, storeName, address, phone, email } = req.body;

    try {
        // Ambil user dari request (email sudah ada di token)
        const userQuery = "SELECT * FROM users WHERE id = ?";
        const [users] = await db.promise().query(userQuery, [req.userId]);

        if (users.length === 0) {
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }

        // Periksa apakah user sudah menjadi seller
        const sellerQuery = "SELECT * FROM sellers WHERE userId = ?";
        const [existingSellers] = await db.promise().query(sellerQuery, [req.userId]);

        if (existingSellers.length > 0) {
            return res.status(400).json({ msg: "Anda sudah mendaftarkan toko" });
        }

        // Simpan data toko di database
        const insertSellerQuery = `
            INSERT INTO sellers (userId, fullName, storeName, address, phone, email)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        await db.promise().query(insertSellerQuery, [req.userId, fullName, storeName, address, phone, email]);

        // Update role user menjadi seller
        const updateRoleQuery = "UPDATE users SET role = 'seller' WHERE id = ?";
        await db.promise().query(updateRoleQuery, [req.userId]);

        res.status(201).json({ msg: "Toko berhasil didaftarkan" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
};

export const checkStoreStatus = async (req, res) => {
    try {
        const sellerQuery = "SELECT * FROM sellers WHERE userId = ?";
        const [sellers] = await db.promise().query(sellerQuery, [req.userId]);

        if (sellers.length > 0) {
            return res.status(200).json({ hasStore: true, storeName: sellers[0].storeName });
        }

        res.status(200).json({ hasStore: false });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
};

export const getSeller = async (req, res) => {
    try {
        const sellerQuery = "SELECT * FROM sellers WHERE userId = ?";
        const [sellers] = await db.promise().query(sellerQuery, [req.userId]);

        if (sellers.length === 0) {
            return res.status(404).json({ msg: "Data seller tidak ditemukan" });
        }

        const seller = sellers[0];

        res.status(200).json({
            msg: "Data seller berhasil diambil",
            seller: {
                fullName: seller.fullName,
                storeName: seller.storeName,
                address: seller.address,
                phone: seller.phone,
                email: seller.email,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
};
