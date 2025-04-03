
const express = require('express');
const app = express();
const { adminAuth, userAuth } = require('./middlewares/auth.js');


// Handle Auth middleware for all GET,POST,PUT,DELETE requests

app.get("/admin/getAllData", adminAuth, (req, res) => {
    res.send("All Data sent");
});
app.get("/admin/deleteData", adminAuth, (req, res) => {
    res.send("Data deleted");
});

app.get("/user/login", (req, res) => {
    res.send("User login page");
})

app.get("/user/getData", userAuth, (req, res) => {
    res.send("User data sent");
})

app.listen(8005, () => {
    console.log('Server is running on port 8005');
});