import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes:['id', 'name', 'email']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

export const Register = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    // Validasi password dan konfirmasi password
    if (password !== confirmPassword) {
        return res.status(400).json({ msg: "Password dan konfirmasi password tidak cocok" });
    }

    try {
        // Periksa apakah email sudah terdaftar
        const existingUser = await User.findOne({
            where: {
                email: email,
            },
        });

        if (existingUser) {
            return res.status(400).json({ msg: "Email telah terdaftar" });
        }

        // Jika email belum terdaftar, buat user baru
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        await User.create({
            name: name,
            email: email,
            password: hashPassword,
        });

        res.json({ msg: "Register berhasil" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
};

export const Login = async (req, res) => {
    try {
        // Mencari user berdasarkan email
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        // Jika user tidak ditemukan
        if (!user) {
            return res.status(404).json({ msg: "Email tidak ditemukan" });
        }

        // Memeriksa apakah password cocok
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return res.status(400).json({ msg: "Password salah" });
        }

        const userId = user.id;
        const name = user.name;
        const email = user.email;

        // Membuat accessToken dan refreshToken
        const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1d',
        });

        const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d',
        });

        // Menyimpan refreshToken ke database
        await User.update({ refresh_token: refreshToken }, {
            where: {
                id: userId
            }
        });

        // Mengirimkan refreshToken dalam cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 hari
        });

        // Mengirimkan accessToken ke frontend
        res.json({ accessToken });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
};


export const Logout = async (req, res)=>{
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken) return res.sendStatus(204);
    const user = await User.findAll({
        where:{
            refresh_token : refreshToken
        }
    });
    if(!user[0]) return res.sendStatus(204);
    const userId = user [0].id; 
    await User.update({refresh_token: null},{
        where:{
            id:userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}