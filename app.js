const express = require('express');
const app = express();




app.get("/user", (req, res) => {
    // res.send("Hello Surya welcome to home page")
    res.send({ firstName: "Surya", lastName: "Kumar" })
})

app.post("/user", (req, res) => {
    res.send("Saved data to the DB successfully")
})

app.delete("/user", (req, res) => {
    res.send("Deleted data from the DB successfully")
})


app.use("/info", (req, res) => {
    res.send("Hello Surya welocme to info page")
})



app.listen(8005, () => {
    console.log('Server is running on port 8005');
});