const mongoose = require("mongoose");

module.exports = async function connection() {
    const URL = "mongodb+srv://test:1234@cluster0.6gbs8q3.mongodb.net/?retryWrites=true&w=majority"
    try {
        await mongoose.connect(URL, { useUnifiedTopology: true, useNewUrlParser: true });
        console.log("Database Connected Sucessfully");
    } catch (error) {
        console.log("Error while connecting with database", error.message);
    }
};