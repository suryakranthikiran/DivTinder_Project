const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequestModel = require("../models/connectionRequest");
const { set } = require("mongoose");
const user = require("../models/user");
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

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const connectionRequest = await connectionRequestModel.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" },
            ]
        }).populate("fromUserId", "firstName lastName photoUrl gender age about skills").populate("toUserId", "firstName lastName photoUrl gender age about skills")
        const data = connectionRequest.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId
            }
            return row.fromUserId
        })
        res.json({ data })
    } catch (error) {
        res.status(404).send("ERROR : ", error.message)
    }
})

userRouter.get("/feed", userAuth, async (req, res) => {

    try {

        // user should see all the user cards except
        // 1. his own card
        // 2. his connections
        // 3. ignored people
        // 4. already sent connection request

        // example : Rahul=>[Surya,sarojini,Srinu,Jesus,Lakshmi,Tarun]

        // Rahul->Surya Rahul->Sarojini(liked both surya and sarojini) now rahul feed can see => [Srinu,Jesus,Lakshmi,Tarun]

        // Surya rejected Rahul request so Rahul can't see surya profile again

        // Sarojini accepted the Rahul request so Sarojini profile can't display in Rahul Feed

        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        limit = limit > 50 ? 50 : limit

        const skip = (page - 1) * limit

        // find all connectionRequest either i have sent or i received

        const connectionRequest = await connectionRequestModel.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
        }).select("fromUserId toUserId")
        const hideUsersFromFeed = new Set()
        connectionRequest.forEach(req => {
            hideUsersFromFeed.add(req.fromUserId.toString())
            hideUsersFromFeed.add(req.toUserId.toString())
        })
        const users = await user.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select("firstName lastName photoUrl gender age about skills").skip(skip).limit(limit)
        res.send(users)

    } catch (error) {
        res.status(404).send("ERROR : ", error.message)
    }
})

module.exports = userRouter;