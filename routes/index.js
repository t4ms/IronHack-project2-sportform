const express = require('express');
const router  = express.Router();

const Court = require('../models/court-model');
const User = require('../models/user-model');

/* GET home page */


router.get('/', (req, res, next) => {
  Court.find()
  .populate('owner')
  .then(courtsFromDB => {
    courtsFromDB.forEach(onecourt => {
      if(req.user){
        if(onecourt.owner.equals(req.user._id)){
          onecourt.isOwner = true;
        }
      }
    })
    res.render('index', { courtsFromDB })
  })
  .catch( err => next(err) )
})

module.exports = router;
