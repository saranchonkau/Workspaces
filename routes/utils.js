
/*
 * Return 'true' if user was blocked and 'false' otherwise
*/
module.exports.checkUserBlock = function(req, res){
    if (req.user.isBlocked) {
        req.logOut();
        console.log(req.isAuthenticated() ? 'User is active !' : 'User is blocked !');
        res.redirect('/login');
        return true;
    } else {
        return false;
    }
};