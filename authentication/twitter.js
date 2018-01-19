const express = require('express');
const app = express();
const passport = require('passport');

// Routes
// URI = '/auth/twitter'
app.get('/', passport.authenticate('twitter'));

// URI = '/auth/twitter/callback'
app.get('/callback',
    passport.authenticate('twitter', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));


module.exports = app;

