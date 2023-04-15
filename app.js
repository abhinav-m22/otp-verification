const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const exphbs = require('express-handlebars');
const { User } = require("./models/user.js");
const connection = require("./config/db.js");

const { createUser, testPassword } = require("./controller/user-controller.js")

const { generateOTP } = require("./services/genOTP.js");
const { sendMail } = require('./services/Mail.js');
const app = express();

app.engine('handlebars', exphbs({ extname: "hbs", defaultLayout: false, layoutsDir: "views/ " }));
app.set('view engine', 'handlebars');

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use('/public', express.static(path.join(__dirname, 'public')));

(async () => await connection())();

app.get('/', function (req, res) {
    res.render('contact');
});

var email;

const otp = generateOTP();
console.log(otp);

app.post('/send', async function (req, res) {
    console.log(req.body);
    email = req.body.email;

    testPassword(req, res);

    createUser(req, res);

    await sendMail({
        to: email,
        OTP: otp
    });

    res.render('otp');
});

app.post('/verify', async function (req, res) {

    console.log(req.body);
    const user = await User.findOne({ email });
    user.otp = otp;
    user.save();

    if (req.body.otp === otp) {
        user.isValidated = true;
        res.send("You have been successfully registered");
    }
    else {
        res.render('otp');
    }
});

app.post('/resend', async function (req, res) {

    const newOTP = generateOTP();
    console.log((newOTP));
    const user = await User.findOne({ email });
    user.otp = newOTP;
    user.save();

    sendMail({
        to: email,
        OTP: newOTP
    });

    if (req.body.otp === newOTP) {
        user.isValidated = true;
        res.send("You have been successfully registered");
    }
    else {
        res.render('otp');
    }

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`app is live at ${PORT}`);
})