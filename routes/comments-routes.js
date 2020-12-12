const express = require('express');
const router  = express.Router();
const Court = require('../models/court-model');
const Comment = require('../models/comments-model');


// create a new comment
router.post('/courts/:courtId/add-comment', (req, res, next) => {
  const newComment = {
    user: req.user._id,
    comment: req.body.comment,
    canBeChanged: false
  }

  Comment.create(newComment)
  .then(theNewComment => {
    Court.findById(req.params.courtId)
    .then(foundcourt => {
      foundcourt.comments.push(theNewComment._id);
      foundcourt.save()
      .then(() => {
        res.redirect(`/courts/${foundcourt._id}`)
      })
      .catch(err => next(err));
    })
    .catch(err => next(err));
  })
  .catch(err => next(err));
})

router.post('/comments/:id', (req, res, next) => {
  Comment.findByIdAndDelete(req.params.id)
  .then(() => {
    Court.findOne({'comments': req.params.id}) 
    .then(foundcourt => {
      for(let i=0; i< foundcourt.comments.length; i++ ){
        console.log(foundcourt.comments[i]._id.equals(req.params.id))
        if(foundcourt.comments[i]._id.equals(req.params.id)){
          foundcourt.comments.splice(i, 1);
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


