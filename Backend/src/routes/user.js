const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();
// Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const connectionRequest = await connectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName lastName photoUrl gender age about skills")

        res.json({
            message: "Data fetched successfully",
            data: connectionRequest
        })
    } catch (error) {
        res.status(404).send("ERROR : ", error.message)
    }
})


module.exports = userRouter;