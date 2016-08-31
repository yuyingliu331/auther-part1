'use strict';

var app = require('express')();
var path = require('path');
var session = require('express-session');
var passport = require('passport');

var HttpError = require('../utils/HttpError');
var User = require('../api/users/user.model');

app.use(session({
  // this mandatory configuration ensures that session IDs are not predictable
  secret: 'pizza' // or whatever you like
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  console.log('session', req.session);
  next();
});

app.use(require('./logging.middleware'));
app.use(require('./request-state.middleware'));

// Google authentication and login
app.get('/auth/google', passport.authenticate('google', { scope : 'email' }));

// handle the callback after Google has authenticated the user
app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect : '/', // or wherever
    failureRedirect : '/' // or wherever
  })
);

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(
  new GoogleStrategy({
    clientID: '371392621220-29i40bfafn8jhjlehc3l6a6lgdgt6osa.apps.googleusercontent.com',
    clientSecret: 'KsGwd71p7_PLIyliT37Pr0EE',
    callbackURL: 'http://localhost:8080'
  },
  // Google will send back the token and profile
  function (token, refreshToken, profile, done) {
    // the callback will pass back user profile information and each service (Facebook, Twitter, and Google) will pass it back a different way. Passport standardizes the information that comes back in its profile object.
    /*
    --- fill this part in ---
    */

    //   var info = {
    //   name: profile.displayName,
    //   email: profile.emails[0].value,
    //   photo: profile.photos ? profile.photos[0].value : undefined
    // };
    // User.findOrCreate({
    //   where: {googleId: profile.id},
    //   defaults: info
    // })
    // .spread(function (user) {
    //   done(null, user);
    // })
    // .catch(done);

    console.log('---', 'in verification callback', profile, '---');
    done();
  })
);

app.post('/login', function (req, res, next) {
  console.log("this is req.body", req.body);
  User.findOne({
    where: req.body
  })
  .then(function (user) {
    console.log("this is the user", user);
	   if (!user) {
       res.sendStatus(401);
    }else{
      req.session.userId = user.id;
      console.log("this is the session userId", req.session.userId);
      //how to send status 204?
      res.send(user);
    }
  })
  .catch(next);
});

app.get('/logout', function(req, res, next) {
  req.session = null;
  res.sendStatus(200);
});

app.get('/auth/me', function(req, res, next) {
  User.findOne({
    where: req.session.userId
  }).then(function(user) {
    if (!user) {
      res.sendStatus(401);
    }
    res.send(user);
  })
  .catch(next);
});

app.use('/api', require('../api/api.router'));



var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
var indexPath = path.join(__dirname, '..', '..', 'public', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
  app.get(stateRoute, function (req, res) {
    res.sendFile(indexPath);
  });
});

app.use(require('./statics.middleware'));

app.use(require('./error.middleware'));

module.exports = app;
