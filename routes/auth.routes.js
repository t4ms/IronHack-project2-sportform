// routes/auth.routes.js

const { Router } = require('express');
const router = new Router();

// User model
const Player= require('../models/player.model.js');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.get('/signup', (req, res, next) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  // 1. Check username and password are not empty
  if (!username || !password) {
    res.render('auth/signup', { errorMessage: 'Indicate username and password' });
    return;
  }

  Player
  .findOne({ username })
  .then(player => {
      // 2. Check user does not already exist
      if (player !== null) {
        res.render('auth/signup', { message: 'The username already exists' });
        return;
      }

      // Encrypt the password
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      //
      // Save the user in DB
      //

      const newPlayer = new Player({
        username,
        password: hashPass
      });

      newPlayer
        .save()
        .then(() => res.redirect('/'))
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

module.exports = router;
