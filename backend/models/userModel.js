const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
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
        },
        darkMode: {
            type: Boolean,
            default: false
        }
    },
    {timestamps: true}
);

UserSchema.virtual("comments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "user"
});

UserSchema.set("toObject", {virtuals: true});
UserSchema.set("toJSON", {virtuals: true});

UserSchema.statics.register = async function (email, password) {
    if (!email || !password) {
        throw new Error("All fields must be provided");
    }
    if (!validator.isEmail(email)) {
        throw new Error("Email is invalid");
    }
    if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong enough");
    }

    const exists = await this.findOne({email});
    if (exists) {
        throw new Error("Email already in use");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({email, password: hash});

    return user;
};

UserSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw new Error("All fields must be provided");
    }

    const user = await this.findOne({email});
    if (!user) {
        throw new Error("Incorrect email");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new Error("Incorrect password");
    }

    return user;
};

module.exports = mongoose.model("User", UserSchema);