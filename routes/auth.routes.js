// routes/auth.routes.js

const { Router } = require('express');
const router = new Router();

const Player= require('../models/player.model.js');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.get('/signup', (req, res, next) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {
  const playerEmail = req.body.email;
  const playerPassword = req.body.password;
  const playerFirstName = req.body.firstName;
  const playerLastName = req.body.LastName;


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

module.exports = router;
