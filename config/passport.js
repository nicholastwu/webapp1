var LocalStrategy = require('passport-local').Strategy
var User = require('../models/user');

module.exports = function(passport) {
  
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });


//Sign up strategy
  passport.use('local-signup', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
    process.nextTick(function() {
      User.findOne({ 'local.username' : username }, function(err, user) {
        if (err)
          return done(err);
        if (user) {
          return done(null, false, req.flash('signupMessage', 'Username is taken.'))
        } else {
          var newUser = new User();
          newUser.local.username = username;
          newUser.local.password = newUser.generateHash(password);
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser, req.flash('profileMessage', 'You have been successfully signed up.'));
          });
        }
      });
    });
  }));

//Log in strategy
	passport.use('local-login', new LocalStrategy({
		passReqToCallback: true
	},
	function(req, username, password, done) {
		User.findOne({ 'local.username' : username }, function(err, user) {
			if (err)
				return done(err);
			if (!user || !user.validPassword(password)) {
				console.log('failed login');
				return done(null, false, req.flash('loginMessage', 'Invalid username or password.'));
			}
			return done(null, user, req.flash('profileMessage', 'You have been successfully logged in.'));
			});
	}));
};
