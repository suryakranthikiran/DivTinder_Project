const express = require('express');
const app = express();



app.use("/user", (req, res, next) => {
    res.send("Response 1")
    next()
}, [(req, res, next) => {
    res.send("Response 2")
    next()
}, (req, res, next) => {
    res.send("Response 3")
    next()
}], (req, res, next) => {
    res.send("Response 4")
    next()
}, (req, res, next) => {
    res.send("Response 5")
    next()
})



app.listen(8005, () => {
    console.log('Server is running on port 8005');
});