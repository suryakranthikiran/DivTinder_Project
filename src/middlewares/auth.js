const jwt = require("jsonwebtoken")
const User = require("../models/user")
const userAuth = async (req, res, next) => {
    // access user profile using JWT token
    try {
        // Read the token from the request
        const { token } = req.cookies
        if (!token) {
            throw new Error("Invalid token")
        }
        // Validate the token
        const decodedObj = await jwt.verify(token, "DEV@Tinder$790")
        const { _id } = decodedObj

        // Find the user
        const user = await User.findById(_id)
        if (!user) {
            throw new Error("User not found")
        }
        req.user = user
        next();

    } catch (error) {
        return res.status(400).send("ERROR : " + error.message)

    }
}
module.exports = { userAuth };