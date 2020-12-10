require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const logger       = require('morgan');
const path         = require('path');

//Requirements session -> sessions.config
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose')


// Set up the database
require('./configs/db.config');

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();


// require('./configs/session.config');


// Set up sessions -> session.config.js

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    }),
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
      })
  })
);



const Player = require('./models/player.model.js');

// ...

passport.serializeUser((player, cb) => cb(null, player._id));

passport.deserializeUser((id, cb) => {
  Player.findById(id)
    .then(user => cb(null, user))
    .catch(err => cb(err));
});

passport.use(
  new LocalStrategy(
    { passReqToCallback: true },
    {
      emailField: 'email', // by default
      passwordField: 'password' // by default
    },
    (email, password, done) => {
      Player.findOne({ email })
        .then(player => {
          if (!player) {
            return done(null, false, { message: 'Incorrect email' });
          }

          if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false, { message: 'Incorrect password' });
          }

          done(null, player);
        })
        .catch(err => done(err));
    }
  )
);



app.use(passport.initialize());
app.use(passport.session());



// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = '*** sportform *** ';



const index = require('./routes/index');
app.use('/', index);
const router = require('./routes/auth.routes');
app.use('/', router);


module.exports = app;
