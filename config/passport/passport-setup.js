const passport =require('passport');
const User = require('../../models/user-model');
// require connect-flash for flash messages
const flash = require('connect-flash');

/////// REQUIRE ALL THE STRATEGIES ////////////
require('./local-strategy');
// require('./slack-strategy');
// require('./google-strategy');
///////////////////////////////////////////////

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId)
    .then(user => {
      done(null, user);
    })
    .catch( err => done(err));
})

function passportBasicSetup(sessionLogin){

  sessionLogin.use(passport.initialize());
  sessionLogin.use(passport.session());
  sessionLogin.use(flash());
  sessionLogin.use((req, res, next) => {
    res.locals.messages = req.flash();
    if(req.user){
      res.locals.currentUser = req.user;
    }
    next();
  })
}

module.exports = passportBasicSetup;
