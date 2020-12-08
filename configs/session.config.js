

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
 
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    }),
    resave: true,
    saveUninitialized: false // <== false if you don't want to save empty session object to the store
  })
);