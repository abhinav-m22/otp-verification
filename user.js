const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fName: {
        type: String,
        min: 3,
        max: 255,
    },
    lName: {
        type: String,
        min: 3,
        max: 255,
    },
    email: {
        type: String,
    },
    pass: {
        type: String,
    },
});

const User = mongoose.model("user", userSchema);

module.exports = {User}