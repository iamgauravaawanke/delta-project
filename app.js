// =====================
// Dependencies & Config
// =====================

if (process.env.NODE_ENV === "production") {
  require('dotenv').config();
}

// console.log(process.env)  // remove this after you've confirmed it is working
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



const port = 3000;

// =====================
// Models & Utilities
// =====================
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const wrapAsync = require("./utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js")
const userRouter  = require("./routes/user.js");
const { config } = require('dotenv');
const { error } = require('console');


// =====================
// MongoDB Connection
// =====================
// const MONGO_URI = "mongodb://localhost:27017/wanderlust";

const dbUrl = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(dbUrl);
}
main()
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// =====================
// View Engine & Middleware
// =====================
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

   



const store =  MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
      secret: "mysupersecretcode"

    },
    touchAfter: 24*3600,

})

;
store.on("error" , ()=>{
  console.log("ERROR IN MONGO SESSION STORE " ,err);
})
const sessionOptions = {
    store,
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true, // Fixed typo here as well
    cookie : {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge : + 7 * 24 * 60 * 60 * 1000,

    }
}; 




app.use(session(sessionOptions));
app.use(flash());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// app.use(passport.initialize());
app.use(passport.initialize());      // ✅ UNCOMMENT THIS
app.use(passport.session());



app.use( (req, res,next) =>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user
  next();
}
);

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// =====================
// Routes
// =====================

// Home


// CREATE - Add new listing to DB


// ==========
// Reviews
// ==========

// CREATE Review


// =====================
// Error Handling
// =====================

// 404 fallback (optional)
// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found"));
// });
app.get('/', (req, res) => {
  res.send('🚀 API is running successfully!');
});
// Central error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// =====================
// Start Server
// =====================
const port = process.env.port || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server running at http://0.0.0.0:${PORT}`);
});
