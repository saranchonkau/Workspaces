const router = require('express').Router();
const passport = require('passport');
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut;


/* GET users listing. */
router.get('/',
    ensureLoggedOut(),
    function(req, res, next) {
        res.render('login');
    });

router.post('/', passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login'})
);

module.exports = router;
