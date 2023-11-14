const User = require( "../models/userModel" );
const mongoose = require( "mongoose" );
const jwt = require("jsonwebtoken");
const Suggestion = require("../models/suggestionModel");

// create token
const createToken = (_id) => {
    return jwt.sign({ _id: _id }, process.env.TOKEN_SECRET, {
        expiresIn: "3d",
    });
};

// LOGIN user
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.status(200).json({ email, token, id: user._id});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// REGISTER user
const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.register(email, password);
        const token = createToken(user._id);
        res.status(200).json({ email, token, id: user._id});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// GET all users
const getUsers = async ( req, res ) => {
     const users = await User.find().select( "email" ).sort({ createdAt: -1 });

     try {
          res.status( 200 ).json( users );
     } catch ( error ) {
          res.status( 400 ).json({ error });
     }
};

// GET user
const getUser = async ( req, res ) => {
    const { id } = req.params;

    if ( !mongoose.Types.ObjectId.isValid( id ) ) {
        return res.status( 404 ).json({ error: "No such user" });
    }

    const user = await User.find({ _id: id }).populate({path: "comments", select: "body createdAt"});

    if ( !user ) {
        return res.status( 404 ).json({ error: "No such user" });
    }

    try {
        res.status( 200 ).json( user );
    } catch ( error ) {
        res.status( 400 ).json({ error });
    }
};

// DELETE user
const deleteUser = async ( req, res ) => {
     const { id } = req.params;

     if ( !mongoose.Types.ObjectId.isValid( id ) ) {
          return res.status( 404 ).json({ error: "No such user" });
     }

     const user = await User.findOneAndDelete({ _id: id });

     if ( !user ) {
          return res.status( 404 ).json({ error: "No such user" });
     }

     try {
          res.status( 200 ).json({ message: "User deleted successfully" });
     } catch ( error ) {
          res.status( 400 ).json({ error });
     }
};

// UPDATE user
const updateUser = async ( req, res ) => {
     const { id } = req.params;

     if ( !mongoose.Types.ObjectId.isValid( id ) ) {
          return res.status( 404 ).json({ error: "No such user" });
     }

     const user = await User.findOneAndUpdate(
         { _id: id }, { ...req.body }
     );

     if ( !user ) {
          return res.status( 404 ).json({ error: "No such user" });
     }

     try {
          res.status( 200 ).json({ message: "User updated successfully" });
     } catch ( error ) {
          res.status( 400 ).json({ error });
     }
};

module.exports = { login, register, getUsers, getUser, deleteUser, updateUser };