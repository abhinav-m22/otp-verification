const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
        min: 3,
        max: 255,
    },
    lastname: {
        type: String,
        min: 3,
        max: 255,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    otp: {
        type: String
    },
    isValidated: {
        type: Boolean
    }
});

const User = mongoose.model("user", userSchema);

module.exports = { User }