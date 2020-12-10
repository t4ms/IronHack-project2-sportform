// routes/auth.routes.js

const { Router } = require('express');
const router = new Router();
const passport = require('passport');
const User = require('../models/user.model.js');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.get('/signup', (req, res, next) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const userFirstName = req.body.firstName;
  const userLastName = req.body.lastName;


  if(userEmail == '' || userPassword == ''){
    res.render('auth/signup', { errorMessage: 'Please provide your email and password.' });
    return;
  }

  User
    .findOne({ email: userEmail })
    .then(user => {
      if (user !== null) {
        res.render('auth/signup', { message: 'The email already exists' });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(userPassword, salt);

      const newUser = new User({
        email: userEmail,
        password: hashPass,
        firstname: userFirstName,
        lastname: userLastName
      });

      newUser
        .save()
        .then(() => res.redirect('/'))
        .catch(err => next(err));
    })
    .catch(err => next(err));
});



router.get('/login', (req, res, next) => res.render('auth/login'));
 
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);



module.exports = router;
