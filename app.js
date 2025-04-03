const express = require('express');
const app = express();




app.get("/user/:userId/:name/:password", (req, res) => {
    // res.send("Hello Surya welcome to home page")
    // console.log(req.params);
    res.send(req.params)
})



app.listen(8005, () => {
    console.log('Server is running on port 8005');
});