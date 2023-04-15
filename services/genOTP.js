const otpGenerator = require("otp-generator");
const { OTP_LENGTH, OTP_CONFIG } = require("../constants/constants.js");

function generateOTP(){
    const OTP = otpGenerator.generate(OTP_LENGTH, OTP_CONFIG);
    return OTP;
}

module.exports = { generateOTP };