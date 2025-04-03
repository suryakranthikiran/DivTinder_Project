const express = require('express');
const app = express();


app.use("/", (req, res) => {
    res.send("Hello Surya welocme to express js")
})

app.use("/info", (req, res) => {
    res.send("Hello Surya welocme to info page")
})

app.use("/user", (req, res) => {
    res.send("Hello Surya welocme to users page")
})

app.listen(8005, () => {
    console.log('Server is running on port 8005');
});