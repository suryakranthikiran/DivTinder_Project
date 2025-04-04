const express = require('express');
const app = express();
const connectDB = require("./config/database.js")
const User = require("./models/user.js")
app.use(express.json()) // Middleware to parse JSON request body

app.post("/signup", async (req, res) => {
    // Creating a new instance of User Model
    try {
        const user = new User(req.body);
        // this function will return a promise to us
        await user.save()
        res.send("User Created Successfully")

    } catch (error) {
        res.status(500).send("Error creating user")
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
