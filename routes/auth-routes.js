const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const passport = require('passport');
const User = require('../models/user-model');

const bcrypt = require('bcryptjs');
const bcryptSalt = 10;

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
})


router.post('/signup', (req, res, next) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const userFullName = req.body.fullName;

  if( userEmail === '' || userPassword === '' || userFullName === '' ){
    req.flash('error', 'Please fill all the fields.');
    res.redirect('/signup');
    return;
  }


  // find user by inputted email
  User.findOne({ email: userEmail })
  .then(foundUser => {
    if(foundUser !==null){
      req.flash('error', 'Sorry, there is already player with the same email!');
      res.redirect('/login');
      return;
    }


    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPassword = bcrypt.hashSync(userPassword, salt);

  User.create({
    email: userEmail,
    password: hashPassword,
    fullName: userFullName
    })
      .then(user => {
          req.login(user, (err) => {
            if(err){
              req.flash.error = 'some message here'
              req.flash('error', 'Auto login does not work so please log in manually ✌🏻');
              res.redirect('/login');
              return;
            }
            res.redirect('/private');
          })
      })
      .catch( err => next(err)); 
  })
  .catch( err => next(err));
});

//////////////// LOGIN /////////////////////
router.get('/login', (req, res, next) => {
  // renders the page with the login up form from the "views/auth" folder
  res.render('auth/login');
});

// we use passport.authenticate() method with local strategy to verify user's credentials and let them login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/private', // <== successfully logged in
  failureRedirect: '/login', // <== login failed so go to '/login' to try again
  failureFlash: true,
  passReqToCallback: true
}));

//////////////// LOGOUT /////////////////////

router.post('/logout', (req, res, next) => {
  req.logout(); // <== .logout() method comes from passport and takes care of the destroying the session for us
  res.redirect('/login');
})

//////////////// SLACK LOGIN /////////////////////
router.get('/slack-login', passport.authenticate('slack'));

//   callbackURL: '/slack/callback' => from 'slack-strategy.js'
router.get('/slack/callback', passport.authenticate('slack', {
  successReturnToOrRedirect:'/private',
  successFlash:'Slack login successful!',
  failureRedirect:'/login',
  failureMessage:'Slack login failed. Pease try to login manually. 🙏🏻'
}))

//////////////// GOOGLE LOGIN /////////////////////

router.get("/google-login", passport.authenticate("google", {
  scope: ["https://www.googleapis.com/auth/plus.login",
          "https://www.googleapis.com/auth/plus.profile.emails.read"]
}));

router.get("/google/callback", passport.authenticate("google", {
  successRedirect: "/private",
  successMessage: 'Google login successful!',
  failureRedirect: "/login",
  failureMessage: 'Google login failed. Please try to login manually.'
}));



module.exports = router;
