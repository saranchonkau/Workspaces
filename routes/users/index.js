const router = require('express').Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const User = require('../../models/user');
const utils = require('../utils');

/* GET userlist page. */
router.get('/',
    ensureLoggedIn(),
    function(req, res, next) {
        if(!utils.checkUserBlock(req, res)) {
            User.find(function (err, users) {
                res.render('userlist', {users: users});
            });
        }
    });

router.get('/:id/delete',
    ensureLoggedIn(),
    function(req, res, next) {
        if(!utils.checkUserBlock(req, res)) {
            console.log('Delete user with ID: ', req.params.id);
            User.findByIdAndRemove(req.params.id, function (doc) {
                console.log('Removed user: ', doc);
                res.redirect('/users');
            });
        }
    });

router.get('/:id/block',
    ensureLoggedIn(),
    function(req, res, next) {
        if(!utils.checkUserBlock(req, res)) {
            User.findByIdAndUpdate(req.params.id, {isBlocked: true}, function () {
                if (req.user._id === req.params.id) {
                    req.logOut();
                    console.log(req.isAuthenticated() ? 'User is still logged in' : 'User log out successfully');
                    res.redirect('/login');
                } else {
                    res.redirect('/users');
                }
            });
        }
    });

router.get('/:id/unblock',
    ensureLoggedIn(),
    function(req, res, next) {
        if(!utils.checkUserBlock(req, res)) {
            console.log(req.params.id);
            User.findByIdAndUpdate(req.params.id, {isBlocked: false}, function () {
                res.redirect('/users');
            });
        }
    });

module.exports = router;
