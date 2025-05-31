const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
// controllers
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })


  router
      .route("/")
      .get(wrapAsync(listingController.index))
      .post(isLoggedIn, validateListing,
       upload.single("listing[image][url]"),  
       wrapAsync(listingController.createListings));
      
    
router.get("/new", isLoggedIn, listingController.renderNewForm),
 
   

  router
  .route("/:id")
  .get( wrapAsync(listingController.showListings))
  .put( validateListing,
  isLoggedIn, 
  isOwner,
  validateListing,
  upload.single("listing[image][url]"), 
  wrapAsync(listingController.updateListings))
  .delete( 
  isLoggedIn ,
  isOwner,
  wrapAsync(listingController.deleteListings)),



// NEW - Show form to create new listing

// EDIT - Show form to edit listing
router.get("/:id/edit", 
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)),







module.exports = router;