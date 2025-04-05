const express = require('express');
const app = express();
const connectDB = require("./config/database.js")
const User = require("./models/user.js")
app.use(express.json()) // Middleware to parse JSON request body
const bcrypt = require("bcrypt")
const { validateSignUpData } = require("./utils/validation.js")
const cookieParser = require("cookie-parser")
app.use(cookieParser())
const jwt = require("jsonwebtoken")


// Signup Api - POST /signup - create a new user in the database
// This API will create a new user in the database
app.post("/signup", async (req, res) => {

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

app.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body

        // Validation of data in database whether the user is present or not
        const user = await User.findOne({ email: email })
        if (!user) {
            throw new Error("Invalid email or password")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (isPasswordValid) {

            // create JWT token and send it to the user
            const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790")
            // console.log(token);
            res.cookie("token", token)

            res.send("User logged in successfully")
        } else {
            throw new Error("Inavalid email or password")
        }


    } catch (error) {
        res.status(400).send("ERROR : " + error.message)

    }
})

// access user profile using JWT token
app.get("/profile", async (req, res) => {
    try {
        const cookie = req.cookies;
        const { token } = cookie
        if (!token) {
            throw new Error("Invalid token")
        }
        const decodedMessage = await jwt.verify(token, "DEV@Tinder$790")
        // console.log(decodedMessage);
        const { _id } = decodedMessage
        // console.log("logged in user id: ", _id);
        const user = await User.findById(_id)
        if (!user) {
            throw new Error("User not found")
        }
        // console.log(cookie);
        res.send(user)

    } catch (error) {
        res.status(400).send("ERROR : " + error.message)

    }
})

// finding user on DB using mail

app.get("/user", async (req, res) => {
    const userMail = req.body.email;
    try {
        const user = await User.findOne({ email: userMail });
        if (user.length === 0) {
            return res.status(404).send("User not found");
        } else {
            res.send(user);
        }
    } catch (error) {
        res.status(500).send("Error finding user")
    }
})


// Feed API - GET / feed - get all users from the database
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send("Error finding users")

    }
}
)

// Delete the user from the database using the id

app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).send("User not found");
        } else {
            res.send("User deleted successfully");
        }
    } catch (error) {
        res.status(500).send("Error deleting user")
    }
})

// Update the data of the user 

app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    try {
        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
        const isUpdateAllowed = Object.keys(data).every((key) => {
            return ALLOWED_UPDATES.includes(key)
        })
        if (!isUpdateAllowed) {
            throw new Error("Invalid updates")
        }
        if (data.skills.length > 10) {
            throw new Error("Skills should be less than 10")
        }
        const user = await User.findByIdAndUpdate(userId, data, { returnDocument: 'after', runValidators: true });
        // console.log(user);
        if (!user) {
            return res.status(404).send("User not found");
        } else {
            res.send("User updated successfully");
        }
    } catch (error) {
        res.status(500).send("Error updating " + error.message)
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
