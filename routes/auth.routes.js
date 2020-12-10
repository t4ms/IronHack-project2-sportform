// routes/auth.routes.js

const { Router } = require('express');
const router = new Router();
const passport = require('passport');
const Player= require('../models/player.model.js');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.get('/signup', (req, res, next) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {
  const playerEmail = req.body.email;
  const playerPassword = req.body.password;
  const playerFirstName = req.body.firstName;
  const playerLastName = req.body.lastName;


  if(playerEmail == '' || playerPassword == ''){
    res.render('auth/signup', { errorMessage: 'Please provide your email and password.' });
    return;
  }

  Player
    .findOne({ email: playerEmail })
    .then(player => {
      if (player !== null) {
        res.render('auth/signup', { message: 'The email already exists' });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(playerPassword, salt);

      const newPlayer = new Player({
        email: playerEmail,
        password: hashPass,
        firstname: playerFirstName,
        lastname: playerLastName
      });

      newPlayer
        .save()
        .then(() => res.redirect('/'))
        .catch(err => next(err));
    })
    .catch(err => next(err));
});



router.get('/login', (req, res, next) => res.render('auth/login'));
 
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, playerEmail, failureDetails) => {
    if (err) {
      // Something went wrong authenticating user
      return next(err);
    }

    if (!playerEmail) {
      // Unauthorized, `failureDetails` contains the error messages from our logic in "LocalStrategy" {message: '…'}.
      res.render('auth/login', { errorMessage: 'Wrong password or username' });
      return;
    }

    // save user in session: req.user
    req.login(playerEmail, err => {
      if (err) {
        // Session save went bad
        return next(err);
      }

      // All good, we are now logged in and `req.user` is now set
      res.redirect('/');
    });
  })(req, res, next);
});

router.get('/private-page', (req, res) => {
  if (!req.body.email) {
    res.redirect('/login'); // can't access the page, so go and log in
    return;
  }
 
  // ok, req.user is defined
  res.render('private', { user: req.body.email });
});


module.exports = router;
