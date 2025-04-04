const express = require('express');
const app = express();
const connectDB = require("./config/database.js")
const User = require("./models/user.js")

app.post("/signup", async (req, res) => {
    const userObj = {
        firstName: "Surya",
        lastName: "Tamarapilli",
        email: "s@gmail.com",
        password: "s@123",
        age: 25,
        gender: "Male"
    }
    // Creating a new instance of User Model
    const user = new User(userObj);

    try {
        // this function will return a promise to us
        await user.save()
        res.send("User Created Successfully")

    } catch (error) {
        res.status(500).send("Error creating user")
    }


})


connectDB().then(() => {
    console.log("Database connected successfully");
    app.listen(8005, () => {
        console.log('Server is running on port 8005');
    });
}).catch((error) => {
    console.error("Database connection failed", error.message);
})
