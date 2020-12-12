const express = require('express');
const router  = express.Router();
const Court = require('../models/court-model');
const Review = require('../models/review-model');


// create a new review
router.post('/courts/:courtId/add-review', (req, res, next) => {
  // step 1: create a new review
  const newComment = {
    user: req.user._id,
    comment: req.body.comment,
    canBeChanged: false
  }

  Review.create(newComment)
  .then(theNewComment => {
    // step 2: find the court that the new comment belongs to
    court.findById(req.params.courtId)
    .then(foundcourt => {
      // when find the court, push the ID of the new comment into the 'reviews' array
      foundcourt.reviews.push(theNewComment._id);
      // step 3: save the changes you just made in the found court
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


// delete review
// since we have saved reviews inside reviews collection and as array of ids in the courts' reviews,
// we have to make sure when deleted, the review disappears from the reviews collection and from
// the court's reviews array
router.post('/reviews/:id', (req, res, next) => {
  Review.findByIdAndDelete(req.params.id) // <--- deleting review from reviews collection
  .then(() => {
    court.findOne({'reviews': req.params.id}) // <--- find a court that has the review we deleted from the collections
    .then(foundcourt => {

      // loop through all the reviews and when find matching ids...
      for(let i=0; i< foundcourt.reviews.length; i++ ){
        console.log(foundcourt.reviews[i]._id.equals(req.params.id))
        if(foundcourt.reviews[i]._id.equals(req.params.id)){
          // ... use method splice to delete that id from the array
          foundcourt.reviews.splice(i, 1);
        }
      }
      // make sure you save the changes in the court (you just deleted one review id from its array of reviews,
      // so that needs to be saved in the database)
      foundcourt.save()
      .then(() => {
        res.redirect(`/courts/${foundcourt._id}`)
      })
      .catch(err => next(err))
    })
  })
})




module.exports = router;


