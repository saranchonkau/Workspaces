const app = require('express')();
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut;
const mongoose = require('mongoose');
const User = require('../models/user');

app.get('/',
    ensureLoggedOut(),
    function(req, res, next) {
        let id = req.query.id;
        User.findById(id, function (err, user) {
            if(!user){
                console.log(err);
            } else {
                req.logIn(user, function(err) {
                    console.log('Is user logged in?? So its : ', req.isAuthenticated());
                    if (err) { return next(err); }
                    User.findByIdAndUpdate(id, {isActive: true}, function () {
                        return res.redirect('/');
                    });
                });
            }
        })

    });

module.exports = app;
