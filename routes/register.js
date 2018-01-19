const router = require('express').Router();
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut;
const mongoose = require('mongoose');
const User = require('../models/user');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ivan.saranchenkov@gmail.com', // Your email id
        pass: 'Tapo4ek007' // Your password
    }
});


router.get('/',
    ensureLoggedOut(),
    function(req, res, next) {
        res.render('registration'/*, { title: 'Welcome' }*/);
    });

router.post('/',
    ensureLoggedOut(),
    function(req, res, next) {
        console.log("Before User creation");
        let user = new User({
        _id: new mongoose.Types.ObjectId().toString(),
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
    user.save(function (err, product, numAffected) {
        if (err) {console.log(err);}
    });
        let mailOptions = {
            from: 'example@gmail.com', // sender address
            to: user.email, // list of receivers
            subject: 'Email Example', // Subject line
            html: '<b><a href="http://localhost:3000/confirm?id=' + user._id + '">✔ Confirm </a></b>' // You can choose to send an HTML body instead
        };
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
            }else{
                console.log('Message sent: ' + info.response);
            };
        });

        res.render('login', {needToConfirm: true});
    });


module.exports = router;
