const express = require('express');
const router  = express.Router();

const Court = require('../models/court-model');
const User = require('../models/user-model');

const axios = require('axios');


router.get('/courts/add', isLoggedIn, (req, res, next) => {
  res.render('court-pages/add-court');
});

router.post('/create-court', (req, res, next) => {

  const courtName = req.body.name;
  const courtSport = req.body.sport;
  const courtDate = req.body.date;
  const courtstartTime = req.body.startTime;
  const courtendTime = req.body.endTime;
  const courtDescription = req.body.description;

  if(courtName == '' || courtSport == '' ||  courtDate == '' || courtstartTime == '' || courtendTime == ''){
    req.flash('error', 'Please fill all the fields, mate.');
    res.redirect('courts/add');
    return;
    }

  const address = req.body.location;
  const google_key = process.env.GOOGLE_MAPS_API_KEY
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${google_key}`

  axios.get(url)
    .then(response => {
    const formattedAddress = response.data.results[0].formatted_address;
    const coordinates = response.data.results[0].geometry.location;

    console.log("...")
    console.log(response.data.results[0].formatted_address)
    console.log("...")
      
    Court.create({
      name: courtName,
      sport: courtSport, 
      date: courtDate,
      startTime: courtstartTime,
      endTime: courtendTime,
      description: courtDescription,
      owner: req.user._id,
      location: formattedAddress,
      lat: coordinates.lat,
      lng: coordinates.lng })
      
  .then( newcourt => {
    res.redirect('/');
  })
  .catch(error => console.log(`Error while creating a new court: ${error}`));
})
  .catch( err => next(err) )
});


// show all the courts
router.get('/courts', (req, res, next) => {
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
    res.render('court-pages/court-map', { courtsFromDB })
  })
  .catch( err => next(err) )
})


// get the details of a specific court
router.get('/courts/:courtId',isLoggedIn, (req, res, next) => {

Court.findById(req.params.courtId)
  .populate('player')
  .populate('owner')
  .populate({path: 'comments', populate: {path:'user'}})
  .then(foundcourt => {
    if(foundcourt.owner.equals(req.user._id)){
      foundcourt.isOwner = true;
    }
    
    Promise.all(foundcourt.comments.filter(singlecomment => {       
      if(singlecomment.user._id.equals(req.user._id)){ 
        singlecomment.canBeChanged = true;
      }
      return singlecomment;
    }))
    .then(() => {
      res.render('court-pages/court-details', { court: foundcourt } )
    })
    .catch( err => next(err) )
  })
  .catch( err => next(err) )
})

router.post('/courts/:courtId/update', (req, res, next) => {

  const courtName = req.body.name;
  const courtSport = req.body.sport;
  const courtDate = req.body.date;
  const courtstartTime = req.body.startTime;
  const courtendTime = req.body.endTime;
  const courtDescription = req.body.description;
  const courtLongitude = req.body.longitude;
  const courtLongitud= req.body.latitude;

  const updatedcourt = { 
    name: courtName,
    sport: courtSport, 
    date: courtDate,
    startTime: courtstartTime,
    endTime: courtendTime,
    description: courtDescription,
      location: {
        type: 'Point',
        coordinates: [courtLongitude, courtLatitud]
      },
      owner: req.user._id	                                                             
    }

Court.findByIdAndUpdate(req.params.courtId, updatedcourt)
      .then( theUpdatedcourt => {
         res.redirect(`/courts/${theUpdatedcourt._id}`);  
        //  
        })
      .catch( err => next(err) )
    })

// delete a specific court
router.post('/courts/:id/delete', (req, res, next) => {
  Court.findByIdAndDelete(req.params.id)
  .then(() => {
    res.redirect('/');
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
