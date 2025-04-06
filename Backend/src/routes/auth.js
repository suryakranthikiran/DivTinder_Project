const express = require('express');
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation.js")
const User = require("../models/user.js")
const bcrypt = require("bcrypt")


// Signup Api - POST /signup - create a new user in the database
// This API will create a new user in the database
authRouter.post("/signup", async (req, res) => {

    try {
        // Validation of data
        validateSignUpData(req)

        const { password, firstName, lastName, email } = req.body

        // encrypt the passsword
        const passwordHash = await bcrypt.hash(password, 10)
        // console.log(passwordHash);

        // Creating a new instance of User Model
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
        });
        // Saving the user to the database
        await user.save()
        res.send("User Created Successfully")

    } catch (error) {
        res.status(400).send("ERROR : " + error.message)
    }
})


authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        // Validation of data in database whether the user is present or not
        const user = await User.findOne({ email: email })
        if (!user) {
            throw new Error("Invalid email or password")
        }
        const isPasswordValid = await user.validatePassword(password)
        if (isPasswordValid) {
            // create JWT token and send it to the user
            const token = await user.getJWT()
            // console.log(token);
            res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) })
            res.send("User logged in successfully")
        } else {
            throw new Error("Inavalid email or password")
        }
    } catch (error) {
        res.status(400).send("ERROR : " + error.message)
    }
})

module.exports = authRouter 