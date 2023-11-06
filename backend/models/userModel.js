const mongoose = require( "mongoose" );
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: [true, "Email already exists"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        }
    },
    { timestamps: true }
);

UserSchema.statics.register = async function (email, password) {
    // // validation
    // if (!email || !password) {
    //     throw new Error("All fields must be provided");
    // }
    // // check if email is valid
    // if (!validator.isEmail(email)) {
    //     throw new Error("Email is invalid");
    // }
    // // check if password is strong enough
    // if (!validator.isStrongPassword(password)) {
    //     throw new Error("Password is not strong enough");
    // }

    // Check if email exists
    const exists = await this.findOne({ email });
    if (exists) {
        throw new Error("Email already in use");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create a new user
    const user = await this.create({ email, password: hash });

    return user;
};

module.exports = mongoose.model( "User", UserSchema );