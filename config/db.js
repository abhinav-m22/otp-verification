const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

module.exports = async function connection() {
    const URL = process.env.DB
    try {
        await mongoose.connect(URL, { useUnifiedTopology: true, useNewUrlParser: true });
        console.log("Database Connected Sucessfully");
    } catch (error) {
        console.log("Error while connecting with database", error.message);
    }
};