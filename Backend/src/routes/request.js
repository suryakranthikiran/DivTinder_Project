const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const connectionRequestModel = require('../models/connectionRequest.js');
const User = require('../models/user.js');

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status
        const isAllowedStatus = ["ignored", "interested"]
        if (!isAllowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid Status Type : " + status
            })
        }




        const toUser = await User.findById(toUserId)
        if (!toUser) {
            return res.status(400).json({
                message: "User not found"
            })
        }


        // if there is an existing request, 
        const existingRequest = await connectionRequestModel.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })
        if (existingRequest) {
            return res.status(400).json({
                message: "Connection request already exists"
            })
        }
        const connectionRequest = new connectionRequestModel({
            fromUserId,
            toUserId,
            status
        })
        const data = await connectionRequest.save()
        res.json({
            message:
                status === "ignored"
                    ? req.user.firstName + " " + status + " " + toUser.firstName
                    : status === "interested"
                        ? req.user.firstName + " is " + status + " in " + toUser.firstName
                        : "Unknown status",
            data: data
        });

    } catch (error) {
        res.status(400).send("ERROR : " + error.message)
    }
}
)
module.exports = requestRouter 