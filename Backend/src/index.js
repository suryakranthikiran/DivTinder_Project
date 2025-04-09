const express = require('express');
const app = express();
const connectDB = require("./config/database.js")
app.use(express.json()) // Middleware to parse JSON request body
const cookieParser = require("cookie-parser")
app.use(cookieParser())

const authRouter = require("./routes/auth.js")
const profileRouter = require("./routes/profile.js")
const requestRouter = require("./routes/request.js");
const userRouter = require('./routes/user.js');

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)



connectDB().then(() => {
    console.log("Database connected successfully");
    app.listen(8005, () => {
        console.log('Server is running on port 8005');
    });
}).catch((error) => {
    console.error("Database connection failed", error.message);
})
