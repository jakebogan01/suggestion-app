const User = require( "../models/userModel" );
const mongoose = require( "mongoose" );

const login = async (req, res) => {
    res.json({ message: "login" });
}

const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.register(email, password);
        res.status(200).json({ email, user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { login, register };