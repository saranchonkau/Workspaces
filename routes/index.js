const router = require('express').Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const User = require('../models/user');
const utils = require('./utils');

router.use('/login', require('./login'));
router.use('/register', require('./register'));
router.use('/confirm', require('./confirm'));
router.use('/users', require('./users'));
router.use('/workspaces', require('./workspaces'));
router.use('/auth/facebook', require('../authentication/facebook'));
router.use('/auth/vkontakte', require('../authentication/vkontakte'));
router.use('/auth/twitter', require('../authentication/twitter'));

/* GET home page. */
router.get('/',
    ensureLoggedIn(),
    function(req, res, next) {
        if(!utils.checkUserBlock(req, res)){
            User.find(function (err, users) {
            res.render('index');
            });
        }
    });

router.get('/logout',
    ensureLoggedIn(),
    function(req, res){
        req.logout();
        res.redirect('/login');
    });

router.get('/draw',
    function(req, res, next) {
        res.render('drawing');
    });

module.exports = router;
