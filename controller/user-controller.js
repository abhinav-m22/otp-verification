const asyncHandler = require("express-async-handler")
const { generateOTP } = require("../services/genOTP.js")
const { User } = require("../models/user.js");
const { sendMail } = require("../services/Mail.js")
const bcrypt = require("bcrypt");
const saltRounds = 10;

async function createUser(req, res) {
  const {
    firstname,
    lastname,
    email,
    password
  } = req.body;

  if (!req.body) {
    res.status(400);
    throw new Error("Invalid Query is passed");
  }

  const userExists = await User.findOne({ email });

  // if (userExists) {
  //   res.status(400);
  //   throw new Error("User Already available on this email");
  // }

  let user;
  bcrypt.hash(password, saltRounds, async function (err, hash) {
    user = await User.create({
      firstname,
      lastname,
      email,
      password: hash,
      isValidated: false
    });
  }
  )

  // if (user) {
  //   res.status(201).json({ firstname, lastname, email, password })
  // }
  // else {
  //   res.status(400).json("Fail")
  // }
}

const SendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    const otp = generateOTP();
    console.log(otp);
    try {
      sendMail({
        to: email,
        OTP: otp,
      });

      user.otp = otp;

      user.save().then(() => {
        res.status(200).json("OTP sent");
      })
        .catch((err) => {
          res.status(500).json(`Internal Server Error: ${err}`);
        });
    } catch (error) {
      res.json(400).json(`Failure ${error}`);
    }
  }
});

module.exports = { SendOTP, createUser }