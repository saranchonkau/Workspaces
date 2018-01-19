const express = require('express');
const app = express();
const passport = require('passport');

// URI = '/auth/vkontakte'
app.get('/', passport.authenticate('vkontakte', {scope: 'email'}));

// URI = '/auth/vkontakte/callback'
app.get('/callback',
    passport.authenticate('vkontakte', {
        successRedirect: '/',
        failureRedirect: '/login'
    })
);

module.exports = app;

