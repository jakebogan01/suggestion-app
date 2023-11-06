const User = require( "../models/userModel" );
const mongoose = require( "mongoose" );
const jwt = require("jsonwebtoken");

// create token
const createToken = (_id) => {
    return jwt.sign({ _id: _id }, process.env.TOKEN_SECRET, {
        expiresIn: "3d",
    });
};

const login = async (req, res) => {
    res.json({ message: "login" });
}

const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.register(email, password);
        const token = createToken(user._id);
        res.status(200).json({ email, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { login, register };