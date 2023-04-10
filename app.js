const express = require('express');
const bodyparser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const exphbs = require('express-handlebars');
const { User } = require("./user.js");
const connection = require("./db.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;
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

// var otp = Math.random();
// otp = otp * 10000;
// otp = parseInt(otp);
// console.log(otp);

var digits = '0123456789';
let otp = '';
for (let i = 0; i < 4; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
}
console.log(otp);

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: 'Gmail',

    auth: {
        user: 'ax6038857@gmail.com',
        pass: 'ntljcpcsdacqvjjd',
    }

});

app.post('/send', async function (req, res) {
    console.log(req.body);
    email = req.body.email;

    var mailOptions = {
        to: req.body.email,
        subject: "Otp for registration is: ",
        html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('otp');
    });

    bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
        const newUser = new User({
            fName: req.body.firstname,
            lName: req.body.lastname,
            pass: hash,
            email: req.body.email,
        });
        await newUser.save();
    })

});

app.post('/verify', async function (req, res) {

    console.log(req.body);
    if (req.body.otp == otp) {
        res.send("You have been successfully registered");
        // let user;
        // user = await new User ({
        //     fName: req.body.firstname,
        //     lName: req.body.lastname,
        //     pass: req.body.password,
        //     email:req.body.email
        // }).save()

        // console.log(req.body);
        // const user = req.body;

    }
    else {
        res.render('otp', { msg: 'Otp is incorrect' });
    }
});

app.post('/resend', function (req, res) {
    var mailOptions = {
        to: email,
        subject: "Otp for registration is: ",
        html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        res.render('otp', { msg: "otp has been sent" });
    });

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`app is live at ${PORT}`);
})