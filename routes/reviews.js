const express = require("express");
const router = express.Router({mergeParams:true});
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
// const {  reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthoor}= require("../middleware.js")

const reviewController = require("../controllers/reviews.js");




router.post("/", 
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview));

// DELETE Review
router.delete("/:reviewId",
  isLoggedIn,
  isReviewAuthoor,
  wrapAsync(reviewController.deleteReview));

module.exports= router;


