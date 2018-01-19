const User = require('../models/user');

module.exports = function (passport) {

    // ========== Facebook ============

    const FacebookStrategy = require('passport-facebook').Strategy;

/*
    Configure the Facebook strategy for use by Passport.

    OAuth 2.0-based strategies require a `verify` function which receives the
    credential (`accessToken`) for accessing the Facebook API on the user's
    behalf, along with the user's profile.  The function must invoke `cb`
    with a user object, which will be set at `req.user` in route handlers after
    authentication.
*/

    passport.use('facebook', new FacebookStrategy({
            clientID: 381532735616586,
            clientSecret: 'aaca474794619125cc033fee02738fa8',
            callbackURL: 'http://localhost:3000/auth/facebook/callback'
        },
        function (accessToken, refreshToken, profile, cb) {
/*
            In this example, the user's Facebook profile is supplied as the user
            record.  In a production-quality application, the Facebook profile should
            be associated with a user record in the application's database, which
            allows for account linking and authentication with other identity
            providers.
*/
            return cb(null, profile);
        }));

    // ========== Vkontakte ============

    const VKontakteStrategy = require('passport-vkontakte').Strategy;

    passport.use('vkontakte', new VKontakteStrategy(
        {
            clientID:     6202952, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
            clientSecret: 'ncQt2UaDO0QHhpKVZWgr',
            // Убрать localhost  !!!
            callbackURL:  "http://localhost:3000/auth/vkontakte/callback"
        },
        function (accessToken, refreshToken, params, profile, done) {

/*
            Now that we have user's `profile` as seen by VK, we can
            use it to find corresponding database records on our side.
            Also we have user's `params` that contains email address (if set in
            scope), token lifetime, etc.
            Here, we have a hypothetical `User` class which does what it says.
*/

            User.findOrCreate(
                {_id: 'vk' + profile.id, username: profile.displayName, email: params.email, isActive: true},
                function(err, user, isCreated) {
                    if(!err){
                        isCreated ? console.log('User was created!') : console.log('User was found!');
                    } else {
                        console.log("Error: ", err);
                        return done(null, false);
                    }

                    if (user.isBlocked) {
                        console.log('User is blocked!!!');
                        return done(null, false, { isBlocked: true });
                    }
                    done(null, user);
                }
            );
        }
    ));

    // ========== Twitter ============

    const TwitterStrategy = require('passport-twitter').Strategy;

    passport.use('twitter', new TwitterStrategy({
            consumerKey: '6wkFddIWuCTlShRYvTnAiMW8G',
            consumerSecret: '14MbCd42ssGDK0EvmqdKW3NHgxavlW7paMjAFe4pjGFCbYQJFG',
            callbackURL: "http://localhost:3000/auth/twitter/callback",
            userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
        },
        function(res, token, tokenSecret, profile, done) {
            User.findOrCreate(
                {_id: 'tw' + profile.id, username: profile.displayName, email: profile.emails[0].value, isActive: true},
                function(err, user, isCreated) {
                    if(!err){
                        isCreated ? console.log('User was created!') : console.log('User was found!');
                    } else {
                        console.log("Error: ", err);
                        return done(null, false);
                    }
                    if (user.isBlocked) {
                        console.log('User is blocked!!!');
                        return done(null, false, { isBlocked: true });
                    }
                    done(null, user);
                }
            );
        }
    ));

    // ========== Local ============

    const LocalStrategy = require('passport-local').Strategy;

    passport.use('local', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
        },
        function(email, password, done) {
            User.findOne({ email: email }, function (err, user) {
                if (err) { return done(err); }
                if (!user) {
                    console.log('User with email: %s and password: %s is not found', email, password);
                    return done(null, false, { message: 'Not found.' });
                }
                if (user.password !== password) {
                    console.log('Password: %s is incorrect', password);
                    return done(null, false, { message: 'Incorrect password.' });
                }
                if (!user.isActive) {
                    console.log('User is not active!!!');
                    return done(null, false);
                }
                if (user.isBlocked) {
                    console.log('User is blocked!!!');
                    return done(null, false, { isBlocked: true });
                }
                return done(null, user);
            });
        }
    ));

/*
    Configure Passport authenticated session persistence.

    In order to restore authentication state across HTTP requests, Passport needs
    to serialize users into and deserialize users out of the session.  In a
    production-quality application, this would typically be as simple as
    supplying the user ID when serializing, and querying the user record by ID
    from the database when deserializing.
*/

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        })
    });
};