const mongoose = require("mongoose");

const dbString = "mongodb+srv://tskranthikiran:kYrYLtVOkFeP4C5P@cluster0.i4bz1.mongodb.net/devTinder"
const connectDB = async () => {
    await mongoose.connect(dbString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

module.exports = connectDB;

