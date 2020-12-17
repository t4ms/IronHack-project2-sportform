const express = require('express');
const router  = express.Router();
const Court = require('../models/court-model');
const User = require('../models/user-model');

// create a new comment
router.post('/courts/:courtId/add-player', (req, res, next) => {
  const newPlayer = {
    user: req.user._id,
    player: req.user._id,
    canBeChanged: false
  }


Court.findById(req.params.courtId)
  .then(foundcourt => {
     foundcourt.player.push(newPlayer.user);
     foundcourt.save()
     .then(() => {
        res.redirect(`/courts/${foundcourt._id}`)
      })
      .catch(err => next(err));
    })
    .catch(err => next(err));
  })

router.post('/player/:id', (req, res, next) => {
  Court.findByIdAndDelete(req.params.id)
  .then(() => {
    Court.findOne({'player': req.params.id}) 
    .then(foundcourt => {
      for(let i=0; i< foundcourt.player.length; i++ ){
        console.log(foundcourt.player[i]._id.equals(req.params.id))
        if(foundcourt.player[i]._id.equals(req.params.id)){
          foundcourt.player.splice(i, 1);
        }
      }
      foundcourt.save()
      .then(() => {
        res.redirect(`/courts/${foundcourt._id}`)
      })
      .catch(err => next(err))
    })
  })
})

module.exports = router;


