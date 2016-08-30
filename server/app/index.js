'use strict';

var app = require('express')();
var path = require('path');
var session = require('express-session');

var HttpError = require('../utils/HttpError');
var User = require('../api/users/user.model');

app.use(session({
  // this mandatory configuration ensures that session IDs are not predictable
  secret: 'pizza' // or whatever you like
}));

app.use(function (req, res, next) {
  console.log('session', req.session);
  next();
});

app.use(require('./logging.middleware'));
app.use(require('./request-state.middleware'));

app.post('/login', function (req, res, next) {
  User.findOne({
    where: req.body
  })
  .then(function (user) {
  	console.log("user:",  user);
	if (!user) {
		console.log("no user:", user);
       res.sendStatus(401);
    }else{
    	console.log("has user:", user);
      req.session.userId = user.id;
      res.sendStatus(204);
    }
  })
  .catch(next);
});

app.get('/logout', function(req, res, next) {
	res.redirect('/login');
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
