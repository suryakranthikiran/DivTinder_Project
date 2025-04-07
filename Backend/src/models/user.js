const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 30,
        index: true
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is not valid: " + value)
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter a strong Password: " + value)
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error("Gender not valid")
            }
        },
        lowercase: true,
        trim: true
    },
    photoUrl: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDXHyqEEcIEQzggUF5RIBe8g37M9n1guqKhg&s",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("URL is not valid: " + value)
            }
        }

    },
    about: {
        type: String,
        default: "This is default about me"
    },
    skills: {
        type: [String],
    }
}, { timestamps: true });

userSchema.methods.getJWT = async function () {
    const user = this
    const token = await jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: "7d" })
    return token;
}

userSchema.methods.validatePassword = async function (passswordInputByUser) {
    const user = this
    const passwordHash = user.password
    const isPasswordValid = await bcrypt.compare(passswordInputByUser, passwordHash) // replace "password" with the actual password to compare

    return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);