const router = require('express').Router();
const passport = require('passport');

// Routes
// URI = '/auth/facebook'
router.get('/', passport.authenticate('facebook'));

// URI = '/auth/facebook/callback'
router.get('/callback',
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));


module.exports = router;

