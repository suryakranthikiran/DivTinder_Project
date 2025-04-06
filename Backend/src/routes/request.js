const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js")

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    try {
        const user = req.user
        res.send(`Connection request was sent by ${user.firstName} successfull`)

    } catch (error) {
        res.status(400).send("ERROR : " + error.message)
    }
}
)



module.exports = requestRouter 