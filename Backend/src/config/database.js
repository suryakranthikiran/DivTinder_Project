const mongoose = require("mongoose");
require('dotenv').config();


const connectDB = async () => {
    await mongoose.connect(process.env.DBSTRING_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

module.exports = connectDB;

