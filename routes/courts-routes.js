const express = require('express');
const router  = express.Router();

const Court = require('../models/court-model');
const User = require('../models/user-model');


router.get('/courts/add', isLoggedIn, (req, res, next) => {
  res.render('court-pages/add-court');
});

router.post('/create-court', (req, res, next) => {

  const courtName = req.body.name;
  const courtDate = req.body.date;
  const courtTime = req.body.time;
  const courtDescription = req.body.description;

  Court.create({
    name: courtName,
    date: courtDate,
    time: courtTime,
    description: courtDescription,
    owner: req.user._id
  })
  .then( newcourt => {
    res.redirect('/courts');
  } )
  .catch( err => next(err) )
})

// show all the courts
router.get('/courts', (req, res, next) => {
  Court.find().populate('owner')
  .then(courtsFromDB => {
    courtsFromDB.forEach(onecourt => {
      if(req.user){
        if(onecourt.owner.equals(req.user._id)){
          onecourt.isOwner = true;
        }
      }
    })
    res.render('court-pages/court-list', { courtsFromDB })
  })
  .catch( err => next(err) )
})

// get the details of a specific court
router.get('/courts/:courtId',isLoggedIn, (req, res, next) => {

Court.findById(req.params.courtId)
  .populate('owner')
  .populate({path: 'reviews', populate: {path:'user'}})
  .then(foundcourt => {
    if(foundcourt.owner.equals(req.user._id)){
      foundcourt.isOwner = true;
    }
    
    Promise.all(foundcourt.reviews.filter(singleReview => {       
      if(singleReview.user._id.equals(req.user._id)){ 
        singleReview.canBeChanged = true;
      }
      return singleReview;
    }))
    .then(() => {
      res.render('court-pages/court-details', { court: foundcourt } )
    })
    .catch( err => next(err) )
  })
  .catch( err => next(err) )
})

// post => save updates in the specific court
router.post('/courts/:courtId/update', (req, res, next) => {

  const { name, date, time, description } = req.body;
  // we use ES6 destructuring and if not, we would have to do this -> const name = req.body.name; and const description = req.body.description;

  const updatedcourt = { 
    name,
    date,
    time,                  
    description,           
    owner: req.user._id	   
                         
  }                                                               

Court.findByIdAndUpdate(req.params.courtId, updatedcourt)
.then( theUpdatedcourt => {
    res.redirect(`/courts/${updatedcourt._id}`);
  } )
  .catch( err => next(err) )
})

// delete a specific court
router.post('/courts/:id/delete', (req, res, next) => {
  Court.findByIdAndDelete(req.params.id)
  .then(() => {
    res.redirect('/courts');
  })
  .catch(err => next(err));
})


// this is the function we use to make sure the route and the functionality is 
// available only if we have user in the session
function isLoggedIn(req, res, next){
  if(req.user){
    next();
  } else  {
    req.flash('error', 'You need to log in in order to access the page.')
    res.redirect('/login');
  }

}

module.exports = router;
