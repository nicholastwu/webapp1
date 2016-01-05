module.exports = function(passport) {
  var express = require('express');
  var router = express.Router();
  
  /* GET home page. */  
  router.get('/', function(req, res, next) {  
    res.render('index', { title: 'Homepage', message: req.flash('homeMessage') });
  });
  
  /* GET login page. */
  router.get('/login', function(req, res, next) {
    if (req.isAuthenticated()) {
      req.flash('profileMessage', 'You are already logged in.');
      res.redirect('/profile')
    } else {
    res.render('login', { title: 'Log In', message: req.flash('loginMessage') });
    }
  });

  /*GET signup page. */
  router.get('/signup', function(req, res, next) {
    if (req.isAuthenticated()) {
      req.flash('profileMessage', 'You are already logged in.');
      res.redirect('/profile');
    } else {
    res.render('signup', { title: 'Sign Up', message: req.flash('signupMessage') });
    }
  });

  /* GET profile page. */
  router.get('/profile', isLoggedIn, function(req, res, next) {
    res.render('profile', { title: 'Profile', message: req.flash('profileMessage'), user: req.user });
  });

  /* logout */
  router.get('/logout', function(req, res) {
    req.logout();
    req.flash('homeMessage', 'You have been successfully logged out.');
    res.redirect('/');
  });

  /*POST signup page.*/
  router.post('/signup', function(req, res, next) {
    if (req.body.password != req.body.checkpassword) {
      console.log('password mismatch');
      req.flash('signupMessage', 'Password mismatch.');
      res.redirect('/signup');
    } else { 
      passport.authenticate('local-signup', { successRedirect: '/profile', failureRedirect: '/signup', failureFlash: true , successFlash: true })(req, res, next);
    }
  });

  /*POST login page.*/
  router.post('/login', passport.authenticate('local-login', { successRedirect: '/profile', failureRedirect: '/login', failureFlash: true, successFlash: true }));

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();
    req.flash('homeMessage', 'You are not logged in.');
    res.redirect('/');
  }

  return(router);
}
